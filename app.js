const express = require("express");
const app = express();
const fetch = require("node-fetch");

app.use(express.static("public"));

app.get("/data", async (req, res) => {
  //SETTING UP THE CALL TO THE API
  const query = `
  {
    search(query: "stars:>50000", type: REPOSITORY, first: 10) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            owner {
              login
            }
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  }
`;
  const URL = "https://api.github.com/graphql";
  const options = {
    method: "post",
    headers: {
      "content-type": "application/json",
      authorization: "bearer " + process.env.APIKEY,
    },
    body: JSON.stringify({ query: query }),
  };

  //empty response
  let response;
  try {
    //response will be assinged the fetch() call once received
    response = await fetch(URL, options);
  } catch (error) {
    //error in case it fails
    console.log(error);
  }
  //waiting for the response to parse it to json
  const data = await response.json();
  console.log(data);
  res.json(data);
});

app.listen(3000, () => console.log("Hello there"));
