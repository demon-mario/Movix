import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import "@testing-library/jest-dom/extend-expect"; // For additional matchers

it("test case for li items:", () => {
  render(<Footer />);
  const menuItems = screen.getAllByRole("listitem");
  expect(menuItems).toHaveLength(5);
  const expectedItems = [
    "Terms Of Use",
    "Privacy-Policy",
    "About",
    "Blog",
    "FAQ",
  ];

  menuItems.forEach((item, index) => {
    expect(item).toHaveTextContent(expectedItems[index]);
  });
});

it("test case for text:", () => {
  render(<Footer />);
  const infoText = screen.getByText(
    /Lorem ipsum dolor sit amet, consectetur adipiscing elit/
  );
  expect(infoText).toBeInTheDocument();
});
