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
import Grid from "@mui/material/Grid";

const MatrixExpression = () => {
  const [matrix1, setMatrix1] = React.useState<string>("");
  const [matrix2, setMatrix2] = React.useState<string>("");
  const [mathExp, setMathExp] = React.useState<string>("");
  const [matExp, setMatExp] = React.useState<string>("");
  const [opExp, setOpExp] = React.useState<string>("");
  const [steps, setSteps] = React.useState<string[]>([]);
  const [showSteps, setShowSteps] = React.useState<boolean>(false);
  const [compiledCode, setCompileCode] = React.useState<string>("");

  const compileToMathJax = (operation: string) => {
    const parseMatrix = (matrix: string) => {
      return matrix
        .trim()
        .split(/[\[\]]+/)
        .filter((row) => row.trim() !== "")
        .map((row) => row.trim().split(/\s+/).map(Number));
    };

    const mat1 = parseMatrix(matrix1);
    const mat2 = parseMatrix(matrix2);

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
      case "multiply":
        op = "*";
        setOpExp(op);
        break;
      default:
        op = "+";
    }

    const matrixToString = (matrix: (number | string)[][]) =>
      matrix.map((row) => row.join(" & ")).join(" \\\\ ");

    const initialStep = `$$\\begin{pmatrix} ${matrixToString(
      mat1,
    )} \\end{pmatrix} ${op} \\begin{pmatrix} ${matrixToString(mat2)} \\end{pmatrix}$$`;

    const intermediateStep = mat1.map((row, i) =>
      row.map((value, j) => `${value} ${op} ${mat2[i][j]}`),
    );
    const intermediateExp = `$$\\begin{pmatrix} ${matrixToString(
      intermediateStep,
    )} \\end{pmatrix}$$`;

    const finalStep = mat1.map((row, i) =>
      row.map((value, j) =>
        operation === "add" ? value + mat2[i][j] : value - mat2[i][j],
      ),
    );
    const finalExp = `$$\\begin{pmatrix} ${matrixToString(
      finalStep,
    )} \\end{pmatrix}$$`;

    setSteps([initialStep, intermediateExp, finalExp]);

    setMathExp(initialStep);
  };

  const matrix_to_math = (matrix: string) => {
    const parseMatrix = (matrix: string) => {
      return matrix
        .trim()
        .split(/[\[\]]+/)
        .filter((row) => row.trim() !== "")
        .map((row) => row.trim().split(/\s+/).map(Number));
    };
    const mat = parseMatrix(matrix);
    const matrixToString = (matrix: number[][]) =>
      matrix.map((row) => row.join(" & ")).join(" \\\\ ");
    setMatExp(`$$\\begin{pmatrix} ${matrixToString(mat)} \\end{pmatrix} $$`);
  };

  function evaluate_mat() {
    const mat_interp_api = "http://127.0.0.1:8000/api/matrix/";
    const data = new URLSearchParams();
    const vec_exp: string = matrix1 + opExp + matrix2;
    data.append("exp", vec_exp);
    fetch(mat_interp_api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.exp);
        matrix_to_math(data.exp);
      });
  }

  function compile_mat_exp() {
    const mat_interp_api = "http://127.0.0.1:8000/api/c/matrix/";
    const data = new URLSearchParams();
    const vec_exp: string = matrix1 + opExp + matrix2;
    data.append("exp", vec_exp);
    fetch(mat_interp_api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.exp);
        setCompileCode(data.exp);
      });
  }

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "primary.dark",
        minHeight: "100vh",
        minWidth: "200vh",
        padding: 2,
        overflow: "auto",
      }}
    >
      <MathJaxProvider>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Card
              sx={{ maxWidth: 1000, mx: "auto", bgcolor: "background.paper" }}
            >
              <CardHeader title="Matrix Operations" />
              <CardContent>
                <Box mb={2}>
                  <TextField
                    label="[[4 5 6 7][6 7 8 9]]"
                    id="matrix1-input"
                    fullWidth
                    onChange={(e) => setMatrix1(e.target.value)}
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    label="[[5 6 7 7][7 8 9 0]]"
                    id="matrix2-input"
                    fullWidth
                    onChange={(e) => setMatrix2(e.target.value)}
                  />
                </Box>
                <Box mb={2}>
                  <FormControl fullWidth>
                    <InputLabel id="operator-select-label">Operator</InputLabel>
                    <Select
                      labelId="operator-select-label"
                      id="operator-select"
                      label="Operation"
                      onChange={(e) =>
                        compileToMathJax(e.target.value as string)
                      }
                    >
                      <MenuItem value="add">Add</MenuItem>
                      <MenuItem value="subtract">Subtract</MenuItem>
                      <MenuItem value="multiply">Multiply</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{ maxWidth: 1000, mx: "auto", bgcolor: "background.paper" }}
            >
              <CardHeader title="Input Matrix Expression" />
              <CardContent>
                <Box mt={2}>
                  <MathJaxFormula formula={mathExp} />
                </Box>
                <Button onClick={evaluate_mat}>Evaluate exp</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{ maxWidth: 1000, mx: "auto", bgcolor: "background.paper" }}
            >
              <CardHeader title="Result" />
              <CardContent>
                <Box mt={2}>
                  <MathJaxFormula formula={matExp} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{ maxWidth: 1000, mx: "auto", bgcolor: "background.paper" }}
            >
              <CardHeader title="Computation Steps" />
              <CardContent>
                <Button onClick={() => setShowSteps(!showSteps)}>
                  {showSteps ? "Hide Steps" : "Show Steps"}
                </Button>
                {showSteps &&
                  steps.map((step, index) => (
                    <Box mt={2} key={index}>
                      <MathJaxFormula formula={step} />
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{ maxWidth: 1000, mx: "auto", bgcolor: "background.paper" }}
            >
              <CardHeader title="Generate C code" />
              <CardContent>
                <Button onClick={compile_mat_exp}>Compile to C</Button>
                <Box>
                  <pre>
                    <code>{compiledCode}</code>
                  </pre>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MathJaxProvider>
    </Box>
  );
};

export default MatrixExpression;
