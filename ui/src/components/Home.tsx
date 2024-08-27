import React from "react";
import {
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const Home = () => {
  const topics = [
    {
      title: "Matrices",
      description: "Explore matrix arithmetic",
      href: "matrix",
    },
    {
      title: "Vectors",
      description: "Explore vector arithmetic",
      href: "vector",
    },
    {
      title: "Polynomials",
      description: "Explore polynomial functions",
      href: "polynomial",
    },
    {
      title: "Rational Functions",
      description: "Explore rational functions",
      href: "rational-function",
    },
    { title: "Fractions", description: "Explore fractions", href: "fractions" },
    { title: "Calculus", description: "Explore calculus", href: "calculus" },
  ];

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
      <Grid container spacing={2} justifyContent="center">
        {topics.map((topic, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ maxWidth: 500 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {topic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {topic.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" href={topic.href}>
                  {topic.title} Calculator
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
