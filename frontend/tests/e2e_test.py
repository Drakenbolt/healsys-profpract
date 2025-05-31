from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import unittest

class HealthcareAppTest(unittest.TestCase):
    def setUp(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.get("http://localhost:3000")
        self.wait = WebDriverWait(self.driver, 10)

    def tearDown(self):
        self.driver.quit()

    def test_patient_login_and_appointment_booking(self):
        # Navigate to login page
        login_link = self.wait.until(
            EC.presence_of_element_located((By.LINK_TEXT, "Login"))
        )
        login_link.click()

        # Login as patient
        email_input = self.wait.until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        password_input = self.driver.find_element(By.ID, "password")
        
        email_input.send_keys("patient@example.com")
        password_input.send_keys("patient123")
        
        login_button = self.driver.find_element(By.CLASS_NAME, "auth-button")
        login_button.click()

        # Wait for dashboard to load
        self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "dashboard-container"))
        )

        # Find and click book appointment button
        book_button = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "book-btn"))
        )
        book_button.click()

        # Verify appointment was booked
        success_message = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        self.assertIn("Appointment booked successfully", success_message.text)

    def test_doctor_login_and_appointment_management(self):
        # Navigate to login page
        login_link = self.wait.until(
            EC.presence_of_element_located((By.LINK_TEXT, "Login"))
        )
        login_link.click()

        # Login as doctor
        email_input = self.wait.until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        password_input = self.driver.find_element(By.ID, "password")
        
        email_input.send_keys("doctor@example.com")
        password_input.send_keys("doctor123")
        
        login_button = self.driver.find_element(By.CLASS_NAME, "auth-button")
        login_button.click()

        # Wait for dashboard to load
        self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "dashboard-container"))
        )

        # Update appointment status
        status_select = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "status-select"))
        )
        status_select.click()
        
        completed_option = self.driver.find_element(By.XPATH, "//option[text()='Completed']")
        completed_option.click()

        # Verify status was updated
        success_message = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        self.assertIn("Appointment status updated", success_message.text)

    def test_search_and_filter_doctors(self):
        # Login as patient first
        self.test_patient_login_and_appointment_booking()

        # Find search input
        search_input = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "search-input"))
        )
        search_input.send_keys("General Medicine")

        # Find specialization filter
        specialization_select = self.driver.find_element(By.CLASS_NAME, "specialization-select")
        specialization_select.click()
        
        general_option = self.driver.find_element(By.XPATH, "//option[text()='General Medicine']")
        general_option.click()

        # Verify filtered results
        doctor_cards = self.wait.until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "doctor-card"))
        )
        self.assertTrue(len(doctor_cards) > 0)

if __name__ == "__main__":
    unittest.main() 