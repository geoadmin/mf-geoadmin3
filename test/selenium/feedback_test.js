// Feedback test using browserstack

var webdriver = require('browserstack-webdriver');

var runTest = function(cap, driver, target) {
  if (cap.browser == 'IE' && cap.browser_version == '10.0') {
    //We maximize our window to be sure to be in full resolution
    driver.manage().window().maximize();
    // Goto the travis deployed site.
    driver.get(target + '/?lang=de&widgets=feedback');
    //wait until topics related stuff is loaded. We know this when catalog is there
    driver.findElement(webdriver.By.xpath("//a[contains(text(), 'Grundlagen und Planung')]"));

    // Is the feeback popup open?
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//div[contains(text(),'Problem melden')]"));
    // Click on input field
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//input[@type='email']")).click();
    // Write down your e-mail
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//input[@type='email']")).sendKeys('BSTesting@iwi');
    // Click on feedback field
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//textarea[@name='feedback']")).click();
    // Write down your feedback
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//textarea[@name='feedback']")).sendKeys('This is just an automated test, Don\'t panic, just move this message to the Automated Tests Folder!');
    // Send the feedback
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//button[@type='submit']")).click();
    // Check if the feed back has been sent
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//p[contains(text(),'Bericht erfolgreich versendet')]"));
    // Close popup
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//button[@title='Schliessen']")).click();

    // Check map.revision.admin.ch
    driver.get('http://map.revision.admin.ch/?lang=de');
    // Check if feedback popup is activated
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//div[contains(text(),'Problem melden')]"));
    // Close popup
    driver.findElement(webdriver.By.xpath("//*[@id='feedback-popup']//button[@ng-click='close($event)']")).click();
  }
}

module.exports.runTest = runTest;
