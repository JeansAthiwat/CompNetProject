Feature: Search for courses using tags

  As a Learner,
  I want to search for courses using tags like subject and course type
  So that I can find a course that matches my learning needs

  Scenario: Search for all courses
    Given the search API for courses is available
    When I search for all courses
    Then the response should have a status 200

  Scenario: Search for courses with subject "Math"
    Given the search API for courses is available
    When I search for courses with subject "Math"
    Then the response should have a status 200
    And all returned courses should have the subject "Math"

  Scenario: Search for Video courses
    Given the search API for courses is available
    When I search for courses with course type "Video"
    Then the response should have a status 200
    And all returned courses should have the course type "Video"
