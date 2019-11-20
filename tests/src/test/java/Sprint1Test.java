import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

public class Sprint1Test
{
	private static String BASE_URL = "http://localhost:3000";
	private WebDriver driver;
	
	@Parameters("browser")
	@BeforeMethod
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
	}
	
	@Test
	public void testIssue1() throws Exception
	{
		driver.get(BASE_URL);
		
		// Click on the register button
		driver.findElement(By.xpath("//a[@href='/users/register']")).click();
		
		// Fill the register form
		driver.findElement(By.cssSelector("#name")).sendKeys("I'm selenium");
		driver.findElement(By.cssSelector("#firstname")).sendKeys("I'm selenium");
		driver.findElement(By.cssSelector("#email")).sendKeys("selenium@auto.com");
		driver.findElement(By.cssSelector("#password")).sendKeys("abcdef");
		driver.findElement(By.cssSelector("#password2")).sendKeys("abcdef");
		
		// Click on the register button
		driver.findElement(By.cssSelector("#submitRegister")).click();
		
		// Check if the redirection worked
		WebDriverWait wait = new WebDriverWait(driver, 5);
		wait.until(ExpectedConditions.urlContains(BASE_URL + "/users/login"));
	}
	
	@Test
	public void testIssue2() throws Exception
	{
		driver.get(BASE_URL);
		
		// Fill the login form
		driver.findElement(By.cssSelector("#email")).sendKeys("selenium@auto.com");
		driver.findElement(By.cssSelector("#password")).sendKeys("abcdef");
		
		// Click on the login button
		driver.findElement(By.cssSelector("#submitLogin")).click();
		
		// Check if the redirection worked
		WebDriverWait wait = new WebDriverWait(driver, 5);
		wait.until(ExpectedConditions.urlContains(BASE_URL + "/Projects"));
	}
	
	@Test
	public void testIssue3() throws Exception
	{
		login();
		
		// Click on the disconnect link
		driver.findElement(By.xpath("//a[@href='/users/logout']")).click();
		
		// Check if the user is redirected to the page of login
		WebDriverWait wait = new WebDriverWait(driver, 5);
		wait.until(ExpectedConditions.urlContains(BASE_URL + "/users/login"));
		
		// Check if the user can't access its projects
		driver.get(BASE_URL + "/Projects");
		Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/users/login");		
	}
	
	@Test
	public void testIssue4() throws Exception
	{
		login();
		
		// Click on the "create project" button
		driver.findElement(By.cssSelector("#createFirstProjectButton")).click();
		
		// Fill the form to create a project
		String projectName = "Selenium project";
		String projectDesc = "Selenium made this project";
		driver.findElement(By.cssSelector("#name")).sendKeys(projectName);
		driver.findElement(By.cssSelector("#description")).sendKeys(projectDesc);
		
		// Click on the "create project" button
		driver.findElement(By.cssSelector("#submitCreate")).click();
		
		// Check if the project is displayed on the list of projects
		boolean isDisplayed = false;
		WebElement projectsList = driver.findElement(By.cssSelector("#projectsList"));
		for (WebElement w : projectsList.findElements(By.tagName("tr"))) {
			if (w.getText().contains(projectName) && w.getText().contains(projectDesc)) {
				isDisplayed = true;
				break;
			}
		}
	
		Assert.assertEquals(true, isDisplayed);
	}
	
	@Test
	public void testIssue5Modification() throws Exception
	{
		login();

		// Click on the icon to modify a project
		driver.findElement(By.cssSelector("#projectPageLink")).click();
		
		// Fill new name and description
		String newProjectName = "Selenium project v2";
		String newProjectDesc = "Selenium updated this project";
		driver.findElement(By.cssSelector("#modifyProjectLink")).click();
		driver.findElement(By.cssSelector("#projectName")).clear();
		driver.findElement(By.cssSelector("#projectDesc")).clear();
		driver.findElement(By.cssSelector("#projectName")).sendKeys(newProjectName);
		driver.findElement(By.cssSelector("#projectDesc")).sendKeys(newProjectDesc);
		driver.findElement(By.cssSelector("#submitModify")).click();
		
		// Check if the project has been updated on the list of projects
		driver.get(BASE_URL + "/Projects");
		boolean updated = false;
		WebElement projectsList = driver.findElement(By.cssSelector("#projectsList"));
		for (WebElement w : projectsList.findElements(By.tagName("tr"))) {
			if (w.getText().contains(newProjectName) && w.getText().contains(newProjectDesc)) {
				updated = true;
				break;
			}
		}

		Assert.assertEquals(true, updated);
	}
	
	@Test
	public void testIssue5Delete() throws Exception
	{
		login();
		createWorthlessProject();
		
		// Click on the icon to modify a project
		driver.findElements(By.cssSelector("#projectPageLink")).get(1).click();

		// Delete the project
		driver.findElement(By.cssSelector("#deleteProjectButton")).click();
		driver.findElement(By.cssSelector("#confirmDeleteProject")).click();
		
		// Check if the project no longer appear on the list of projects
		boolean isDisplayed = false;
		WebElement projectsList = driver.findElement(By.cssSelector("#projectsList"));
		for (WebElement w : projectsList.findElements(By.tagName("tr"))) {
			if (w.getText().contains("Worthless project") && w.getText().contains("This project is meant to be deleted")) {
				isDisplayed = true;
				break;
			}
		}
		
		Assert.assertEquals(false, isDisplayed);
	}

	@Test
	public void testIssue6() throws Exception
	{
		login();
		
		boolean isDisplayed = false;
		WebElement projectsList = driver.findElement(By.cssSelector("#projectsList"));
		for (WebElement w : projectsList.findElements(By.tagName("tr"))) {
			if (w.getText().contains("Selenium project v2") && w.getText().contains("Selenium updated this project")) {
				isDisplayed = true;
				break;
			}
		}
		
		Assert.assertEquals(true, isDisplayed);
	}
	
	@AfterMethod
	public void tearDown() throws Exception
	{
		driver.quit();
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
		database.getCollection("projects").deleteOne(Filters.eq("name", "Worthless project"));
		database.getCollection("projects").deleteOne(Filters.eq("name", "Selenium project v2"));
	}
	
	public void login()
	{
		driver.get(BASE_URL);
		driver.findElement(By.cssSelector("#email")).sendKeys("selenium@auto.com");
		driver.findElement(By.cssSelector("#password")).sendKeys("abcdef");
		driver.findElement(By.cssSelector("#submitLogin")).click();
	}
	
	public void createWorthlessProject()
	{
		driver.findElement(By.cssSelector("#createProjectButton")).click();
		driver.findElement(By.cssSelector("#name")).sendKeys("Worthless project");
		driver.findElement(By.cssSelector("#description")).sendKeys("This project is meant to be deleted");
		driver.findElement(By.cssSelector("#submitCreate")).click();
	}
	
}