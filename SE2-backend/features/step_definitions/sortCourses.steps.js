//US2-2

import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";

const baseURL = "http://localhost:39189";
let response;

Given("the sorting API for courses is available", function () {
  // No setup needed, assuming API is running
});

When("I search for courses sorted by {string}", async function (sortBy) {
  response = await request(baseURL).get(`/search?category=course&sortBy=${sortBy}`);
});

Then("the courses should be sorted by name in ascending order", function () {
  const courses = response.body;
  const sortedCourses = [...courses].sort((a, b) => a.course_name.localeCompare(b.course_name));
  expect(courses).to.deep.equal(sortedCourses);
});

Then("the courses should be sorted by name in descending order", function () {
  const courses = response.body;
  const sortedCourses = [...courses].sort((a, b) => b.course_name.localeCompare(a.course_name));
  expect(courses).to.deep.equal(sortedCourses);
});

Then("the courses should be sorted by price in ascending order", function () {
  const courses = response.body;
  const sortedCourses = [...courses].sort((a, b) => a.price - b.price);
  expect(courses).to.deep.equal(sortedCourses);
});

Then("the courses should be sorted by price in descending order", function () {
  const courses = response.body;
  const sortedCourses = [...courses].sort((a, b) => b.price - a.price);
  expect(courses).to.deep.equal(sortedCourses);
});
