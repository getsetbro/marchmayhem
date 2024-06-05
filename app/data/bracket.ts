let tourny = {
  tournament_name: "March Madness 2025",
  rounds: [
    {
      round_number: 1,
      matches: [
        {
          match_id: 1,
          team1: "Team A",
          team2: "Team B",
          winner: null, // User selection for winner (initially null)
          user_selections: {}, // Object to store user selections
        },
        {
          match_id: 2,
          team1: "Team C",
          team2: "Team D",
          winner: null,
          user_selections: {},
        },
        // More matches in round 1
      ],
    },
    {
      round_number: 2,
      matches: [
        {
          match_id: 3,
          team1: "Winner of Match 1",
          team2: "Winner of Match 2",
          winner: null,
          user_selections: {},
        },
        // More matches in round 2
      ],
    },
    // More rounds...
  ],
};
