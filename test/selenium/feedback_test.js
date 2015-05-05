// Feedback test using browserstack

var webdriver = require('browserstack-webdriver');

var runTest = function(cap, driver, target) {
  if (cap.browser == 'chrome' && cap.browser_version == '37') {
    //We maximize our window to be sure to be in full resolution
    driver.manage().window().maximize();
    // Goto the travis deployed site.
    driver.get(target + '/?lang=de');
    //wait until topics related stuff is loaded. We know this when catalog is there
    driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));
    // Click on "Problem melden"
    driver.findElement(webdriver.By.xpath("//*[@id='toptools']//span[contains(text(),'Problem melden')]")).click();
    // Is the feeback popup open?
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//div[contains(text(),'Problem melden')]"));
    // Click on input field
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//input[@type='email']")).click();
    // Write down your e-mail
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//input[@type='email']")).sendKeys('BSTesting@iwi');
    // Click on feedback field
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//textarea[@name='feedback']")).click();
    // Write down your feedback
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//textarea[@name='feedback']")).sendKeys('This is just an automated test, please do not panic!');
  }
}

module.exports.runTest = runTest;
