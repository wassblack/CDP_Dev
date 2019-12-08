import org.bson.Document;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
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

public class Sprint2Test
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
		database.getCollection("userstories").deleteOne(Filters.eq("description", "Super description modifiée"));
		
		driver.quit();
	}

	// Issue 7 and 8
	@Test
	public void testAddUserstory() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();
		
		// Check if the redirection worked
		WebDriverWait wait = new WebDriverWait(driver, 5);
		wait.until(ExpectedConditions.urlContains(BASE_URL + "/project/"));
		
		// Fill the form to add a userstory
		String usDescription = "Super description";
		String usDifficulty = "3";
		String usPriority = "1";
		driver.findElement(By.cssSelector("#addUserstoryButton")).click();
		driver.findElement(By.cssSelector("#description")).sendKeys(usDescription);
		driver.findElement(By.cssSelector("#difficulty")).sendKeys(usDifficulty);
		driver.findElement(By.cssSelector("#priority")).sendKeys(usPriority);
		
		// Click on the submit button
		driver.findElement(By.cssSelector("#submitAddUserstory")).click();
		
		// Check if the user story is displayed on the list of userstories
		WebElement userstoriesList = driver.findElement(By.cssSelector("#userstoriesTable"));
		WebElement userstoryLine = userstoriesList.findElements(By.tagName("tr")).get(1);
		
		Assert.assertEquals(true, 
				userstoryLine.findElements(By.tagName("td")).get(1).getText().contains(usDescription)
			 && userstoryLine.findElements(By.tagName("td")).get(2).getText().contains(usDifficulty)
			 && userstoryLine.findElements(By.tagName("td")).get(3).getText().contains(usPriority));
	}
	
	// Issue 9
	@Test
	public void testAddContributor() throws Exception
	{
		// Click on the icon to add a contributor
		driver.findElement(By.cssSelector("#addContributorLink")).click();
		
		String contributorEmail = "selenium-buddy@auto.com";
		driver.findElement(By.cssSelector("#newUser")).sendKeys(contributorEmail);
		driver.findElement(By.cssSelector("#submitAddContributor")).click();
		
		// Check if the new contributor is displayed
		WebElement projectsList = driver.findElement(By.cssSelector("#projectsList"));
		WebElement contributorColumn = projectsList.findElements(By.tagName("td")).get(2);
		Assert.assertEquals(true, contributorColumn.getText().contains(contributorEmail));
	}
	
	// Issue 10
	@Test
	public void testModifyUserstory() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();

		// Fill the form to modify a userstory
		String usDescription = "Super description modifiée";
		String usDifficulty = "2";
		String usPriority = "2";
		driver.findElement(By.className("modifyUserstory")).click();
		driver.findElement(By.cssSelector("#description")).clear();
		driver.findElement(By.cssSelector("#difficulty")).clear();
		driver.findElement(By.cssSelector("#priority")).clear();
		driver.findElement(By.cssSelector("#description")).sendKeys(usDescription);
		driver.findElement(By.cssSelector("#difficulty")).sendKeys(usDifficulty);
		driver.findElement(By.cssSelector("#priority")).sendKeys(usPriority);
		
		// Click on the submit button
		driver.findElement(By.cssSelector("#submitModifyUserstory")).click();
		
		// Check if the user story was updated in the list of userstories
		WebElement userstoriesList = driver.findElement(By.cssSelector("#userstoriesTable"));
		WebElement userstoryLine = userstoriesList.findElements(By.tagName("tr")).get(1);

		Assert.assertEquals(true, 
				userstoryLine.findElements(By.tagName("td")).get(1).getText().contains(usDescription)
				&& userstoryLine.findElements(By.tagName("td")).get(2).getText().contains(usDifficulty)
				&& userstoryLine.findElements(By.tagName("td")).get(3).getText().contains(usPriority));
	}

	// Issue 11
	@Test
	public void testAddSprint() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();
		
		// Fill the form to add a sprint
		String sprintName = "Sprint test";
		String startDate = "30/03/2020";
		String endDate = "31/08/2020";
		driver.findElement(By.id("createSprintButton")).click();
		driver.findElement(By.cssSelector("#name")).sendKeys(sprintName);
		driver.findElement(By.cssSelector("#startDate")).sendKeys(startDate);
		driver.findElement(By.cssSelector("#endDate")).sendKeys(endDate);
		driver.findElement(By.cssSelector("#submitCreateSprint")).click();
		
		// Check if the sprint was added
		WebElement sprintSection = driver.findElement(By.cssSelector("#sprintSection"));
		Assert.assertEquals(true, 
				sprintSection.getText().contains(sprintName.toUpperCase())
				&& sprintSection.getText().contains("30 Mar 2020")
				&& sprintSection.getText().contains("31 Aug 2020"));	
	}
	
	// Issue 12
	@Test
	public void testModifySprint() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();
		
		// Fill the form to modify a sprint
		String sprintName = "Sprint test modifiée";
		String startDate = "25/11/2019";
		String endDate = "03/03/2045";
		driver.findElement(By.className("modifySprintLink")).click();
		driver.findElement(By.cssSelector("#name")).clear();
		driver.findElement(By.cssSelector("#startDate")).clear();
		driver.findElement(By.cssSelector("#endDate")).clear();
		driver.findElement(By.cssSelector("#name")).sendKeys(sprintName);
		driver.findElement(By.cssSelector("#startDate")).sendKeys(startDate);
		driver.findElement(By.cssSelector("#endDate")).sendKeys(endDate);
		driver.findElement(By.cssSelector("#submitModifySprint")).click();
		
		// Check if the sprint was updated
		WebElement sprintSection = driver.findElement(By.cssSelector("#sprintSection"));
		Assert.assertEquals(true, 
				sprintSection.getText().contains(sprintName.toUpperCase())
				&& sprintSection.getText().contains("25 Nov 2019")
				&& sprintSection.getText().contains("03 Mar 2045"));
	}
	
	// Issue 12
	@Test
	public void testDeleteSprint() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();

		// Click on the icon to delete a sprint
		driver.findElement(By.className("deleteSprintLink")).click();
		
		// Check if the sprint was deleted
		WebElement sprintSection = driver.findElement(By.cssSelector("#sprintSection"));
		Assert.assertEquals(true, sprintSection.getText().contains("VOUS N'AVEZ PAS DE SPRINTS."));
	}

	// Issue 12
	@Test
	public void testAddUserstoryToSprint() throws Exception
	{
		// Click on the project name
		driver.findElement(By.cssSelector("#projectPageLink")).click();
		
		driver.findElement(By.cssSelector("#addUserstoryToSprintButton")).click();
		
		// Check the user story to add 
		String jsCheckCode = "arguments[0].scrollIntoView(true); arguments[0].click();";
		WebElement elementToCheck = driver.findElement(By.name("selectedUs"));
	    ((JavascriptExecutor) driver).executeScript(jsCheckCode, elementToCheck);
	    
	    // Submit it
	    driver.findElement(By.cssSelector("#submitAddUserstoriesToSprint")).click();
	    
	    // Check if the user story was added to the sprint
	 	WebElement sprintUserstoriesTable = driver.findElement(By.cssSelector("#userstoriesSprintTable"));
	 	Assert.assertEquals(true, 
	 			sprintUserstoriesTable.getText().contains("Super description modifiée")
	 			&& sprintUserstoriesTable.getText().contains("2"));
		
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
	
}