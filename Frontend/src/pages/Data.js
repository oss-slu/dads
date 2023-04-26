import React, { useState, useEffect } from "react";
import axios from "axios";

function Data({ width }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  return <p style={{ marginLeft: width }}>test</p>;
}

export default Data;
