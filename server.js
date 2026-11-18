
const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

// Store registration records
let registrations = [
    {
        id: 1,
        participantName: "Karan Singh",
        eventName: "AI Workshop",
        department: "CSE",
        ticketCount: 2,
        paymentStatus: "Pending"
    },
    {
        id: 2,
        participantName: "Riya Sharma",
        eventName: "Tech Fest",
        department: "ECE",
        ticketCount: 3,
        paymentStatus: "Paid"
    }
];

// Validate input
function validateData(data) {
    return (
        typeof data.participantName === "string" &&
        data.participantName.trim() !== "" &&
        typeof data.eventName === "string" &&
        data.eventName.trim() !== "" &&
        typeof data.department === "string" &&
        data.department.trim() !== "" &&
        Number.isInteger(data.ticketCount) &&
        data.ticketCount > 0 &&
        ["Paid", "Pending"].includes(data.paymentStatus)
    );
}

// 1. GET all records
app.get("/api/registrations", (req, res) => {
    res.status(200).json(registrations);
});

// 2. POST new record
app.post("/api/registrations", (req, res) => {
    if (!validateData(req.body)) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const newRecord = {
        ...req.body,
        id: registrations.length
            ? Math.max(...registrations.map(r => r.id)) + 1
            : 1
    };

    registrations.push(newRecord);
    res.status(201).json(newRecord);
});

// 3. GET record by ID
app.get("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);
    const record = registrations.find(r => r.id === id);

    if (!record) {
        return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(record);
});

// 4. PUT update record
app.put("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Not found" });
    }

    if (!validateData(req.body)) {
        return res.status(400).json({ message: "Invalid input" });
    }

    registrations[index] = { ...req.body, id };
    res.status(200).json(registrations[index]);
});

// 5. DELETE record
app.delete("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Not found" });
    }

    registrations.splice(index, 1);
    res.status(200).json({
        message: "Deleted successfully"
    });
});

// 6. Filter by department
app.get("/api/registrations/filter", (req, res) => {
    const department = req.query.department;

    if (!department) {
        return res.status(400).json({
            message: "Department is required"
        });
    }

    const result = registrations.filter(
        r => r.department.toLowerCase() === department.toLowerCase()
    );

    res.status(200).json(result);
});

// 7. Get pending registrations
app.get("/api/registrations/pending", (req, res) => {
    const result = registrations.filter(
        r => r.paymentStatus === "Pending"
    );

    res.status(200).json(result);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
