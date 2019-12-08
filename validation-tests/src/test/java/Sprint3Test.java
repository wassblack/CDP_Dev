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

	// Issue 13
	@Test
	public void testAddTask() throws Exception
	{
		
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