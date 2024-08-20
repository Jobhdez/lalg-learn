import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { MathJaxProvider, MathJaxFormula } from "mathjax3-react";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import "../assets/styles.css";
import Divider from "@mui/material/Divider";

const InputExpression = () => {
  const [vector1, setVector1] = React.useState<string>("");
  const [vector2, setVector2] = React.useState<string>("");
  const [mathExp, setMathExp] = React.useState<string>("");
  const [opExp, setOpExp] = React.useState<string>("");
  const [vecExp, setVecExp] = React.useState<string>("");

  const compileToMathJax = (operation: string) => {
    const parseVector = (vector: string) => {
      return vector
        .replace(/[\[\]]/g, "")
        .trim()
        .split(/\s+/)
        .map(Number);
    };

    const vec1 = parseVector(vector1);
    const vec2 = parseVector(vector2);

    let op: string;
    switch (operation) {
      case "add":
        op = "+";
        setOpExp(op);
        break;
      case "subtract":
        op = "-";
        setOpExp(op);
        break;
      case "dot-product":
        op = "*";
        setOpExp(op);
        break;
      default:
        op = "+";
    }

    setMathExp(
      `$$\\begin{pmatrix} ${vec1.join(" & ")} \\end{pmatrix} ${op} \\begin{pmatrix} ${vec2.join(" & ")} \\end{pmatrix}$$`,
    );
  };

  function vector_to_mathjax(vector: string) {
    const parseVector = (vector: string) => {
      return vector
        .replace(/[\[\]]/g, "")
        .trim()
        .split(/\s+/)
        .map(Number);
    };
    const vec = parseVector(vector);

    setVecExp(`$$\\begin{pmatrix} ${vec.join(" & ")} \\end{pmatrix}$$`);
    console.log(vecExp);
  }

  function evaluate() {
    const vector_interp_api = "http://127.0.0.1:8000/api/vector/"
    const data = new URLSearchParams();
    const vec_exp: string = vector1 + opExp + vector2;
    data.append("exp", vec_exp)
    fetch(vector_interp_api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    }).then((response) => response.json()).then((data) => {console.log(data.exp); vector_to_mathjax(data.exp)})
  }

  return (
    <Box p={45}>
      <MathJaxProvider>
        <Card sx={{ width: 1000, mb: 2 }}>
          <CardHeader title="Vector Operations" />
          <Divider component="li" />
          <CardContent>
            <Box mb={2}>
              <TextField
                label="[2 3 4 5]"
                id="vector1-input"
                fullWidth
                onChange={(e) => setVector1(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="[4 5 6 7]"
                id="vector2-input"
                fullWidth
                onChange={(e) => setVector2(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel id="operator-select-label">Operator</InputLabel>
                <Select
                  labelId="operator-select-label"
                  id="operator-select"
                  label="Operation"
                  onChange={(e) => compileToMathJax(e.target.value as string)}
                >
                  <MenuItem value="add">Add</MenuItem>
                  <MenuItem value="subtract">Subtract</MenuItem>
                  <MenuItem value="dot-product">Dot Product</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ width: 1000, mb: 2 }}>
          <CardHeader title="Vector Operations" />
          <Divider component="li" />
          <CardContent>
            <Box mt={2}>
              <MathJaxFormula formula={mathExp} />
            </Box>
            <Button onClick={evaluate}>Evaluate exp</Button>
          </CardContent>
        </Card>

        <Card sx={{ width: 1000 }}>
          <CardHeader title="Vector Operations" />
          <Divider component="li" />
          <CardContent>
            <Box mt={2}>
              <MathJaxFormula formula={vecExp} />
            </Box>
          </CardContent>
        </Card>
      </MathJaxProvider>
    </Box>
  );
};

export default InputExpression;
