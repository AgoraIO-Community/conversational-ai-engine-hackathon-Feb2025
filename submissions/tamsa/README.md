# Team Example Project

## Project Overview

This is a two-person Battleship game using the AgoraWebSDK for both RTC and sync/control purposes, with AI Agents that are limited to performing moves for the player by voice.

## Setup Instructions

1. Clone the repository:

   ```bash
   cd conversational-ai-engine-hackathon-Feb2025/submissions/tamsa
   ```

2. Vanilla HTML/CSS/JS, run locally in any dev server
3. Lambda functions used to join/stop agent in /doc

## Usage

- This is a two person game of battleship, where player moves can be controlled by voice or by clicking. 
- Click Start Game to start a channel.
- A second player clicks List to Join.
- Second player choses an active channel.
- Now both players can place their ships by clicking on their board.
- Once all are placed, respective agents join.
- PlayerA goes first (green outline), you can say "Fire <COORDINATES>" to have the agent perform the move (ex. "Fire B4").
- Or you can click to just manually perform it (no agent involvement).
- You can try to say "Chose for me" to have it chose for you, doesn't always work.
- Complete the game or press End to end the session for both users and remove the agents. 
- Join As Audience button for viewers, board sync from players is broken but can hear the agents and players.

## Features

- Agent for given player should only listen when it's their turn.
- Press U on keyboard to open agent messages log.


## Demo

Deployed here: https://alekben.github.io/BattleshipAgora/

## Documentation

*TODO
Additional documentation and images can be found in [docs](docs/).

## Contact

For any questions, reach out to the team leads:

- Aleksey Benditch (alekben)
- Frank Molinaro (frank005)
- Jay Albo (jayalbo)
