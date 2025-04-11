Feature: Sort courses based on various parameters

  As a Learner,
  I want to sort courses based on name and price
  So that I can choose a course that fits my schedule and budget

  Scenario: Sort courses by name (A-Z)
    Given the sorting API for courses is available
    When I search for courses sorted by "name"
    Then the response should have a status 200
    And the courses should be sorted by name in ascending order

  Scenario: Sort courses by name (Z-A)
    Given the sorting API for courses is available
    When I search for courses sorted by "-name"
    Then the response should have a status 200
    And the courses should be sorted by name in descending order

  Scenario: Sort courses by price (low to high)
    Given the sorting API for courses is available
    When I search for courses sorted by "price"
    Then the response should have a status 200
    And the courses should be sorted by price in ascending order

  Scenario: Sort courses by price (high to low)
    Given the sorting API for courses is available
    When I search for courses sorted by "-price"
    Then the response should have a status 200
    And the courses should be sorted by price in descending order
