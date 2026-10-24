import { Guide } from '../types';

export const SEED_DATA: Guide[] = [
  {
    id: "guide-1",
    title: "Crispy Thin-Crust Pan Pizza",
    category: "Cooking",
    time: "35 mins",
    difficulty: "Beginner",
    description: "A fast, foolproof stovetop-to-oven pan pizza method with no dough-proofing required on the day.",
    tags: ["Pizza", "Cast Iron", "Dinner", "Italian"],
    prerequisites: ["12-inch cast-iron skillet", "High-heat oven broiler", "Pizza peel or spatula"],
    timesCompleted: 4,
    createdAt: "2026-09-15T10:00:00.000Z",
    updatedAt: "2026-10-10T14:30:00.000Z",
    steps: [
      {
        id: "step-1-1",
        title: "Pan Pre-heating & Dough Prep",
        detail: "Roll out dough thin to approximately 11-12 inches. Coat your cold cast-iron pan with 1 tbsp olive oil. Place dough directly in the cold pan and stretch smoothly to edges.",
        tip: "Make sure you push tiny fork holes into the dough surface so it doesn't bubble up unevenly while cooking.",
        suggestedMinutes: 5,
        checklist: [
          { id: "c1", text: "Coat cast-iron base with olive oil", done: false },
          { id: "c2", text: "Stretch dough to all rim edges", done: false },
          { id: "c3", text: "Dock dough lightly with fork tines", done: false }
        ]
      },
      {
        id: "step-1-2",
        title: "Sauce, Cheese & Toppings",
        detail: "Spread crushed San Marzano tomato sauce all the way to the rim (burnt cheese edges against the iron taste best). Layer low-moisture whole-milk mozzarella and your favorite toppings thinly.",
        tip: "Avoid high-moisture fresh mozzarella or pre-shredded cheese with cellulose powder, or the center will turn soggy.",
        suggestedMinutes: 4,
        checklist: [
          { id: "c4", text: "Spread 3-4 tbsp sauce right to edge", done: false },
          { id: "c5", text: "Add shredded low-moisture mozzarella", done: false },
          { id: "c6", text: "Place toppings without overloading", done: false }
        ]
      },
      {
        id: "step-1-3",
        title: "Stovetop Searing & Broiler Finish",
        detail: "Turn stove burner to high for 4 mins to crisp the bottom crust until deep golden brown. Immediately transfer into oven under high broiler for 4-5 mins.",
        tip: "Watch closely under the broiler! It goes from beautifully caramelized to burnt in 30 seconds.",
        suggestedMinutes: 9,
        checklist: [
          { id: "c7", text: "Sear 4 mins on medium-high stovetop", done: false },
          { id: "c8", text: "Transfer directly under oven broiler", done: false },
          { id: "c9", text: "Rest 2 mins on wire rack before slicing", done: false }
        ]
      }
    ]
  },
  {
    id: "guide-2",
    title: "Drywall Anchor & Heavy Shelf Mount",
    category: "Construction",
    time: "20 mins",
    difficulty: "Intermediate",
    description: "Safely hang floating shelves and heavy decor on drywall without stud support using heavy-duty toggle bolts.",
    tags: ["DIY", "Home Repair", "Tools", "Mounting"],
    prerequisites: ["Cordless drill", "1/2 inch spade or brad-point bit", "Torpedo bubble level", "Snap-toggle bolts"],
    timesCompleted: 2,
    createdAt: "2026-09-20T08:00:00.000Z",
    updatedAt: "2026-10-02T11:15:00.000Z",
    steps: [
      {
        id: "step-2-1",
        title: "Marking and Leveling",
        detail: "Hold shelf bracket against the wall at your desired height. Place bubble level on top edge. Mark hole positions using a sharp pencil.",
        tip: "Double check measurements from the floor on both sides to account for uneven flooring.",
        suggestedMinutes: 5,
        checklist: [
          { id: "c10", text: "Hold bracket firmly with level on top", done: false },
          { id: "c11", text: "Mark center of mounting slots", done: false }
        ]
      },
      {
        id: "step-2-2",
        title: "Drill Pilot Holes",
        detail: "Select drill bit size specified for the snap-toggle bolts (usually 1/2 inch). Drill straight through the drywall marks at moderate speed.",
        tip: "Keep the drill strictly perpendicular to avoid creating oval-shaped holes that toggle caps can slip through.",
        suggestedMinutes: 5,
        checklist: [
          { id: "c12", text: "Confirm bit diameter against toggle body", done: false },
          { id: "c13", text: "Drill straight and blow out gypsum dust", done: false }
        ]
      },
      {
        id: "step-2-3",
        title: "Insert Toggles and Fasten",
        detail: "Slide metal toggle channel through hole, pull nylon strap tight against back of wall, and snap the plastic collar flush. Insert machine bolts through bracket and tighten firmly with a hand screwdriver.",
        tip: "Do not overtighten with a high-torque power drill or you risk cracking the drywall gypsum paper layer.",
        suggestedMinutes: 10,
        checklist: [
          { id: "c14", text: "Insert metal channel through hole", done: false },
          { id: "c15", text: "Slide plastic collar flush and snap straps", done: false },
          { id: "c16", text: "Hand-tighten machine bolts", done: false }
        ]
      }
    ]
  },
  {
    id: "guide-3",
    title: "Clean Docker Dev Environment with Postgres",
    category: "Tech",
    time: "15 mins",
    difficulty: "Intermediate",
    description: "Spin up an isolated, reproducible development container setup with persistent PostgreSQL and hot-reload volume mounts.",
    tags: ["Docker", "PostgreSQL", "DevOps", "Node.js"],
    prerequisites: ["Docker Desktop or OrbStack installed", "Terminal / Shell access"],
    timesCompleted: 7,
    createdAt: "2026-10-01T15:20:00.000Z",
    updatedAt: "2026-10-18T18:45:00.000Z",
    steps: [
      {
        id: "step-3-1",
        title: "Define docker-compose.yml",
        detail: "Create a docker-compose.yml file specifying postgres:16-alpine with healthchecks, mapped port 5432, and a named volume for data persistence.",
        tip: "Always use Alpine-based tags for dev databases to keep image pull size under 100MB.",
        suggestedMinutes: 5,
        checklist: [
          { id: "c17", text: "Set POSTGRES_DB and credentials via env vars", done: false },
          { id: "c18", text: "Declare postgres_data volume block", done: false }
        ]
      },
      {
        id: "step-3-2",
        title: "Container Boot & Health Check Verification",
        detail: "Run `docker compose up -d` in the project root. Inspect status with `docker compose ps` and verify the Postgres service reaches 'healthy' state.",
        tip: "If port 5432 is already bound, check if a local native Postgres service is running in background (`lsof -i :5432`).",
        suggestedMinutes: 3,
        checklist: [
          { id: "c19", text: "Execute `docker compose up -d`", done: false },
          { id: "c20", text: "Verify healthy state in `docker compose ps`", done: false }
        ]
      },
      {
        id: "step-3-3",
        title: "Connect & Run Initial Migration",
        detail: "Connect with your ORM client or GUI (TablePlus/DBeaver) using connection string `postgresql://user:pass@localhost:5432/app_dev`. Run schema migrations.",
        tip: "Store your DATABASE_URL in a local .env.local ignored by git to keep secrets safe.",
        suggestedMinutes: 7,
        checklist: [
          { id: "c21", text: "Test DB connection socket", done: false },
          { id: "c22", text: "Run migration command", done: false }
        ]
      }
    ]
  },
  {
    id: "guide-4",
    title: "Silky Cold Brew Coffee Concentrate (1:4 Ratio)",
    category: "Cooking",
    time: "16 hours (Active: 10 mins)",
    difficulty: "Beginner",
    description: "Extract low-acidity, naturally sweet coffee concentrate using a standard French press or mason jar with slow room-temp immersion.",
    tags: ["Coffee", "Cold Brew", "Beverages", "Meal Prep"],
    prerequisites: ["Coarse-ground coffee beans (150g)", "Filtered room-temp water (600g)", "Large mason jar or French press", "Paper coffee filter"],
    timesCompleted: 12,
    createdAt: "2026-10-05T09:00:00.000Z",
    updatedAt: "2026-10-15T12:00:00.000Z",
    steps: [
      {
        id: "step-4-1",
        title: "Coarse Grind & Water Ratio",
        detail: "Grind 150g of medium-roast beans on the coarsest setting (like kosher sea salt). Pour grounds into a clean glass jar and pour 600g of room temperature filtered water over top.",
        tip: "Never use fine espresso grind or your cold brew will turn unpleasantly bitter and impossible to filter clean.",
        suggestedMinutes: 5,
        checklist: [
          { id: "c23", text: "Weigh 150g beans and coarse grind", done: false },
          { id: "c24", text: "Pour 600g filtered water", done: false }
        ]
      },
      {
        id: "step-4-2",
        title: "Gentle Stir & 16-Hour Steep",
        detail: "Gently stir with a bamboo chopstick or wooden spoon for 30 seconds until all grounds are fully wetted. Seal jar and let steep at cool room temperature (68-72°F) for 16 hours.",
        tip: "Steeping in the fridge slows extraction down significantly; room temp for 16 hours produces the best chocolatey, sweet profile.",
        suggestedMinutes: 2,
        checklist: [
          { id: "c25", text: "Stir grounds until thoroughly saturated", done: false },
          { id: "c26", text: "Place in dark cupboard for 16 hours", done: false }
        ]
      },
      {
        id: "step-4-3",
        title: "Two-Stage Filtration & Bottling",
        detail: "First pour through a metal mesh sieve to catch large grounds. Second, pass the liquid through a rinsed paper coffee filter or V60 cone into a clean amber bottle.",
        tip: "Rinse paper filters with warm water first to eliminate cardboard paper flavor.",
        suggestedMinutes: 8,
        checklist: [
          { id: "c27", text: "Pass through coarse mesh strainer", done: false },
          { id: "c28", text: "Filter through wet paper cone", done: false },
          { id: "c29", text: "Refrigerate (keeps fresh for up to 14 days)", done: false }
        ]
      }
    ]
  }
];
