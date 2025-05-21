"use client";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import ExploreCarte from "../../components/ExploreCarte/ExploreCarte";
import CultureDisplay from "../../components/CultureDisplay/CultureDisplay";
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("All");
  
  return (
    <>
      <Navbar />
      <Header />
      <ExploreCarte category={category} setCategory={setCategory} />
      <CultureDisplay category={category} setCategory={setCategory} />
    </>
  );
}