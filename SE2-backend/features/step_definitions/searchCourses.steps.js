//US2-1

import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";

const baseURL = "http://localhost:39189";
let response;

Given("the search API for courses is available", function () {
  // No setup needed, assuming API is running
});

When("I search for all courses", async function () {
  response = await request(baseURL).get(`/search?category=course`);
});

When("I search for courses with subject {string}", async function (subject) {
  response = await request(baseURL).get(`/search?category=course&subject=${subject}`);
});

When("I search for courses with course type {string}", async function (courseType) {
  response = await request(baseURL).get(`/search?category=course&courseType=${courseType}`);
});

Then("the response should have a status {int}", function (statusCode) {
  expect(response.status).to.equal(statusCode);
});

Then("all returned courses should have the subject {string}", function (subject) {
  const courses = response.body;
  expect(
    courses.every(course => course.subject.toLowerCase().includes(subject.toLowerCase()))
  ).to.be.true;
});



Then("all returned courses should have the course type {string}", function (courseType) {
  const courses = response.body;
  expect(courses.every(course => course.course_type === courseType)).to.be.true;
});
