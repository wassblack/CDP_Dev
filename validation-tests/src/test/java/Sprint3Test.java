import org.bson.Document;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

public class Sprint3Test
{
	private static String BASE_URL = "http://localhost:3000";
	private WebDriver driver;
	
	@Parameters("browser")
	@BeforeTest
	public void setUp(String browser) throws Exception
	{
		if (browser.equals("chrome")) {
			System.setProperty("webdriver.chrome.driver", "WebDrivers/chromedriver.exe");
			driver = new ChromeDriver();
		}
		else if (browser.equals("firefox")) {
			System.setProperty("webdriver.gecko.driver", "WebDrivers/geckodriver.exe");
			driver = new FirefoxDriver();
		}
		
		register();
		login();
		createWorthlessProject();
		createWorthlessUserDB();
		createWorthlessUserstory();
		createWorthlessSprint();
		addUserstoryToSprint();
	}
	
	@BeforeMethod
	public void goHome() throws Exception
	{
		driver.get(BASE_URL);
	}
	
	// Clean the database from the test documents
	@AfterTest
	public void cleanDatabase()
	{
		// Connection to MongoDB
		MongoClient mongoClient = MongoClients.create("mongodb+srv://team:FRNK6OOMZq9PBdMq@cluster0-e1ewl.mongodb.net/scrumit?retryWrites=true&w=majority");
		MongoDatabase database = mongoClient.getDatabase("scrumit");

		// Delete the test documents
		database.getCollection("users").deleteOne(Filters.eq("email", "selenium@auto.com"));
		database.getCollection("users").deleteOne(Filters.eq("email", "selenium-buddy@auto.com"));
		database.getCollection("projects").deleteOne(Filters.and(Filters.eq("name", "Worthless project")
				, Filters.eq("description", "This project is meant to be deleted")));
		database.getCollection("userstories").deleteOne(Filters.eq("description", "Super description"));
		//database.getCollection("userstories").deleteOne(Filters.eq("description", "Super description modifiée"));
		
		driver.quit();
	}

	// Issue 13
	@Test
	public void testAddTask() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();

		// Fill the form to add a task
		String taskDesc = "Cette tâche va être supprimée parce qu'elle sert seulement de test.";
		String developer = "selenium@auto.com";
		String state = "TODO";
		driver.findElement(By.id("createTaskButton")).click();
		driver.findElement(By.cssSelector("#description")).sendKeys(taskDesc);
		driver.findElement(By.cssSelector("#submitCreateTask")).click();

		// Check if the task was added
		WebElement taskSection = driver.findElement(By.cssSelector("#taskSection"));
		Assert.assertEquals(true, 
				taskSection.getText().contains(taskDesc)
				&& taskSection.getText().contains(developer)
				&& taskSection.getText().contains(state));
	}
	
	// Issue 13
	@Test
	public void testLinkTask() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();

		driver.findElement(By.className("linkTask")).click();

		// Check the user story to link 
		String jsCheckCode = "arguments[0].scrollIntoView(true); arguments[0].click();";
		WebElement elementToCheck = driver.findElement(By.name("selectedUs"));
		((JavascriptExecutor) driver).executeScript(jsCheckCode, elementToCheck);

		// Submit it
		Thread.sleep(500);
		driver.findElement(By.cssSelector("#submitLinkTask")).click();

		// Check if the user story was linked to the task
		WebElement tasksTable = driver.findElement(By.cssSelector("#tasksTable"));
		
		WebElement unlinkButton = tasksTable.findElement(By.className("unlinkTask"));
		Assert.assertEquals(true, unlinkButton != null);
	}
	
	// Issue 13
	@Test
	public void testUnlinkTask() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();
		
		driver.findElement(By.className("unlinkTask")).click();
		
		// Check if the user story was unlinked from the task
		WebElement tasksTable = driver.findElement(By.cssSelector("#tasksTable"));
		
		try {
			 tasksTable.findElement(By.className("unlinkTask"));
			 Assert.fail();
		}
		catch(NoSuchElementException e) {}
	}
	
	// Issue 14
	@Test
	public void testModifyTask() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();

		// Fill the form to add a task
		String taskDesc = "Cette tâche va être supprimée parce qu'elle sert seulement de test. Par contre elle a aussi été modifiée";
		String developer = "selenium@auto.com";
		String state = "TODO";
		driver.findElement(By.className("modifyTaskLink")).click();
		driver.findElement(By.cssSelector("#description")).clear();
		driver.findElement(By.cssSelector("#description")).sendKeys(taskDesc);
		driver.findElement(By.cssSelector("#submitModifyTask")).click();

		// Check if the task was added
		WebElement taskSection = driver.findElement(By.cssSelector("#taskSection"));
		Assert.assertEquals(true, 
				taskSection.getText().contains(taskDesc)
				&& taskSection.getText().contains(developer)
				&& taskSection.getText().contains(state));
	}
	
	// Issue 14
	@Test
	public void testDeleteTask() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();

		// Click on the icon to delete a task
		driver.findElement(By.className("deleteTaskLink")).click();

		// Check if the task was deleted
		WebElement taskSection = driver.findElement(By.cssSelector("#taskSection"));
		Assert.assertEquals(true, taskSection.getText().contains("VOUS N'AVEZ PAS DE TÂCHES."));
	}
	
	
	
	public void login()
	{
		driver.get(BASE_URL);
		driver.findElement(By.cssSelector("#email")).sendKeys("selenium@auto.com");
		driver.findElement(By.cssSelector("#password")).sendKeys("abcdef");
		driver.findElement(By.cssSelector("#submitLogin")).click();
	}
	
	public void register() throws Exception
	{
		driver.get(BASE_URL);
		driver.findElement(By.xpath("//a[@href='/users/register']")).click();
		driver.findElement(By.cssSelector("#name")).sendKeys("I'm selenium");
		driver.findElement(By.cssSelector("#firstname")).sendKeys("I'm selenium");
		driver.findElement(By.cssSelector("#email")).sendKeys("selenium@auto.com");
		driver.findElement(By.cssSelector("#password")).sendKeys("abcdef");
		driver.findElement(By.cssSelector("#password2")).sendKeys("abcdef");
		driver.findElement(By.cssSelector("#submitRegister")).click();
	}
	
	public void createWorthlessProject()
	{
		driver.findElement(By.cssSelector("#createFirstProjectButton")).click();
		driver.findElement(By.cssSelector("#name")).sendKeys("Worthless project");
		driver.findElement(By.cssSelector("#description")).sendKeys("This project is meant to be deleted");
		driver.findElement(By.cssSelector("#submitCreate")).click();
	}
	
	public void createWorthlessUserDB()
	{
		// Connection to MongoDB
		MongoClient mongoClient = MongoClients.create("mongodb+srv://team:FRNK6OOMZq9PBdMq@cluster0-e1ewl.mongodb.net/scrumit?retryWrites=true&w=majority");
		MongoDatabase database = mongoClient.getDatabase("scrumit");

		// Insert a user to later add him as a contributor
		Document user = new Document("lastname", "I'm selenium buddy")
							.append("firstname", "I'm selenium buddy")
							.append("email", "selenium-buddy@auto.com")
							.append("password", "abcdef");
		database.getCollection("users").insertOne(user);
	}
	
	public void createWorthlessUserstory()
	{
		driver.findElement(By.cssSelector("#projectPageLink")).click();
		
		String usDescription = "Super description";
		String usDifficulty = "3";
		String usPriority = "1";
		driver.findElement(By.cssSelector("#addUserstoryButton")).click();
		driver.findElement(By.cssSelector("#description")).sendKeys(usDescription);
		driver.findElement(By.cssSelector("#difficulty")).sendKeys(usDifficulty);
		driver.findElement(By.cssSelector("#priority")).sendKeys(usPriority);
		driver.findElement(By.cssSelector("#submitAddUserstory")).click();
	}
	
	public void createWorthlessSprint()
	{
		String sprintName = "Sprint test";
		String startDate = "30/03/2020";
		String endDate = "31/08/2020";
		driver.findElement(By.id("createSprintButton")).click();
		driver.findElement(By.cssSelector("#name")).sendKeys(sprintName);
		driver.findElement(By.cssSelector("#startDate")).sendKeys(startDate);
		driver.findElement(By.cssSelector("#endDate")).sendKeys(endDate);
		driver.findElement(By.cssSelector("#submitCreateSprint")).click();
	}
	
	public void addUserstoryToSprint() throws Exception
	{
		driver.findElement(By.cssSelector("#addUserstoryToSprintButton")).click();
 
		String jsCheckCode = "arguments[0].scrollIntoView(true); arguments[0].click();";
		WebElement elementToCheck = driver.findElement(By.name("selectedUs"));
		((JavascriptExecutor) driver).executeScript(jsCheckCode, elementToCheck);
		Thread.sleep(500);
		driver.findElement(By.cssSelector("#submitAddUserstoriesToSprint")).click();
	}

}