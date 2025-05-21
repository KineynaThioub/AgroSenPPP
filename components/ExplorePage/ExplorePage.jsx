"use client";
import React, { useState } from "react";
import ExploreCarte from "../components/ExploreCarte/ExploreCarte";
import CultureDisplay from "../components/CultureDisplay/CultureDisplay";

const ExplorePage = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <ExploreCarte category={category} setCategory={setCategory} />
      <CultureDisplay category={category} />
    </div>
  );
};

export default ExplorePage;
