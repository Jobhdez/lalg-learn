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

const VectorExpression = () => {
  const [vector1, setVector1] = React.useState<string>("");
  const [vector2, setVector2] = React.useState<string>("");
  const [mathExp, setMathExp] = React.useState<string>("");
  const [vecExp, setVecExp] = React.useState<string>("");
  const [opExp, setOpExp] = React.useState<string>("");
  const [steps, setSteps] = React.useState<string[]>([]);
  const [showSteps, setShowSteps] = React.useState<boolean>(false);
  const [compiledCode, setCompileCode] = React.useState<string>("");

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

    const vectorToString = (vector: number[]) => vector.join(" & ");

    const initialStep = `$$\\begin{pmatrix} ${vectorToString(
      vec1,
    )} \\end{pmatrix} ${op} \\begin{pmatrix} ${vectorToString(vec2)} \\end{pmatrix}$$`;

    const intermediateStep = vec1.map(
      (value, i) => `${value} ${op} ${vec2[i]}`,
    );
    const intermediateExp = `$$\\begin{pmatrix} ${intermediateStep.join(" & ")} \\end{pmatrix}$$`;

    const finalStep = vec1.map((value, i) =>
      operation === "add" ? value + vec2[i] : value - vec2[i],
    );
    const finalExp = `$$\\begin{pmatrix} ${finalStep.join(" & ")} \\end{pmatrix}$$`;

    setSteps([initialStep, intermediateExp, finalExp]);

    setMathExp(initialStep);
  };

  const vector_to_mathjax = (vector: string) => {
    const parseVector = (vector: string) => {
      return vector
        .replace(/[\[\]]/g, "")
        .trim()
        .split(/\s+/)
        .map(Number);
    };
    const vec = parseVector(vector);
    setVecExp(`$$\\begin{pmatrix} ${vec.join(" & ")} \\end{pmatrix}$$`);
  };

  function evaluate_vec() {
    const vector_interp_api = "http://127.0.0.1:8000/api/vector/";
    const data = new URLSearchParams();
    const vec_exp: string = vector1 + opExp + vector2;
    data.append("exp", vec_exp);
    fetch(vector_interp_api, {
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
        vector_to_mathjax(data.exp);
      });
  }

  function compile_vec_exp() {
    const vec_interp_api = "http://127.0.0.1:8000/api/c/vector/";
    const data = new URLSearchParams();
    const vec_exp: string = vector1 + opExp + vector2;
    data.append("exp", vec_exp);
    fetch(vec_interp_api, {
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
              <CardHeader title="Vector Operations" />
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
                      onChange={(e) =>
                        compileToMathJax(e.target.value as string)
                      }
                    >
                      <MenuItem value="add">Add</MenuItem>
                      <MenuItem value="subtract">Subtract</MenuItem>
                      <MenuItem value="dot-product">Dot Product</MenuItem>
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
              <CardHeader title="Input Vector Expression" />
              <CardContent>
                <Box mt={2}>
                  <MathJaxFormula formula={mathExp} />
                </Box>
                <Button onClick={evaluate_vec}>Evaluate exp</Button>
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
                  <MathJaxFormula formula={vecExp} />
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
                <Button onClick={compile_vec_exp}>Compile to C</Button>
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

export default VectorExpression;
