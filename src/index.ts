#!/usr/bin/env node

import readDir from "./functions/parseCode/chunkDir";
import { argv } from "process";
import saveToken from "./functions/saveToken";
import authenticate from "./functions/authenticate";
import loadToken from "./functions/loadToken";
import dotenv from 'dotenv';
import select, { Separator } from "@inquirer/select";
import watchDirectory from "./functions/watchDirectory";
import deleteToken from "../src/functions/deleteToken";

dotenv.config();

// MAIN

(async () => {
  console.log(process.env.SITE_URL);
  const path = argv[2]; // Get the directory path from the command-line arguments


  if (path === "logout") {
    deleteToken();
  } else if (path === "link") {
    // CHECK IF USER IS LOGGED IN
    let token: string | null = await loadToken();

    if (!token) {
      console.log(
        "Please login to your Mordecai account in the browser to continue!",
      );

      let freshToken = await authenticate();

      if (freshToken) {
        await saveToken(freshToken);
      } else {
        console.error("Failed to login in.");
        process.exit(1);
      }
    }

    const newToken = (await loadToken()) as string;

    // READ FILES FROM DIRECTORY
    interface answerObject {
      id: string;
      name: string;
    }
    let answer: answerObject = { id: "", name: "" };
    async function getProjects() {
      try {
        const projects = await fetch(`${process.env.SITE_URL}/cli/workspaces`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: newToken }),
        });

        if (projects.ok) {
          const projectData = await projects.json();

          let choicesArr = [];

          for (let i = 0; i < projectData.length; i++) {
            choicesArr.push({
              name: projectData[i].workspaceName,
              value: {
                id: projectData[i].workspaceId,
                name: projectData[i].workspaceName,
              },
            });
          }

          answer = await select({
            message:
              "Select the project that you want to link this directory to",
            choices: choicesArr,
          });

          return answer.id;
        } else {
          console.error("Failed to get projects. Error:", projects.statusText);
        }
      } catch (err) {
        console.log(err);
      }
      return null;
    }

    const workspaceId = (await getProjects()) as string;

    await watchDirectory(".", answer.name, workspaceId, newToken);

    const data = await readDir(".");
    console.log(data);
    console.log("sending:" + newToken);
    const response = await fetch(`${process.env.SITE_URL}/cli/chunk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: data,
        token: newToken,
        workspaceId: workspaceId,
      }),
    });
    //    nvim btw
    if (response.ok) {
      console.log("Data sent succesfully");
    } else {
      console.error(
        "Failed to send data to server. Error:",
        response.statusText,
      );
    }
  } else if (path === "--help" || path === "-h") {

    console.log(`
Mordecai CLI - Connect your codebase with your Mordecai account

Usage: mordecai [command]

Commands:
  link       Link your local project to Mordecai
  logout     Remove stored authentication token
  --help     Display this help message

Examples:
  mordecai link
  mordecai logout
  mordecai --help`)
  } else {
    console.log("Please provide an action.");
  }
})();

// npm run build
// chmod +x dist/src/index.js
// npm link
