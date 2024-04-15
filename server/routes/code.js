const Job = require("../models/Job");
const router = require("express").Router();
const { addJobToQueue, addSubmitToQueue } = require("../jobQueue");
const { generateFile } = require("../ExecuteCode/generateFile");
const verify = require("../middleware/verify");
const fs = require("fs");
const http = require("http");
const path = require("path");

// Маршрут, связанный с кодом

router.post("/run", async (req, res) => {
  let { language = "cpp", code, userInput } = req.body;

  if (code === undefined || !code) {
    return res.status(400).json({ success: false, error: "Пустой код!" });
  }

  let job;
  try {
    // необходимо сгенерировать файл C++ с содержимым запроса
    const filepath = await generateFile(language, code);

    job = await Job({ language, filepath, userInput }).save();
    const jobId = job["_id"];
    addJobToQueue(jobId);

    res.status(201).json({ sueccess: true, jobId });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/submit", verify, async (req, res) => {
  let { language = "cpp", code, userInput, problemId, userId } = req.body;

  if (code === undefined || !code) {
    return res.status(400).json({ success: false, error: "Пустой код!" });
  }

  let job;
  try {

    const filepath = await generateFile(language, code);

    job = await Job({ language, filepath, userInput }).save();
    const jobId = job["_id"];
    addSubmitToQueue(jobId, problemId, userId);

    res.status(201).json({ sueccess: true, jobId });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/status/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json("Отсутствие обязательных полей");
  }

  try {
    const job = await Job.findById(req.params.id);
    // console.log(job);
    res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success: false });
  }
});

// получение всех отправленных
router.get("/submissions", async (req, res) => {
  try {
    const submissions = await Job.find({
      problemId: { $exists: true },
    })
      .populate({
        path: "userId",
      })
      .populate({
        path: "problemId",
      })
      .sort({ submittedAt: -1 })
      .select("status language submittedAt verdict completedAt startedAt");

    return res.status(200).json(submissions);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// получение отпрвленными всеми пользователями решениями
router.get("/submission/:id", verify, async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;
  if (!userId) return res.status(400).json("Отсутствие обязательных полей");

  try {
    const submissions = await Job.find({
      userId,
      problemId,
      verdict: { $exists: true },
    })
      .populate({
        path: "userId",
      })
      .populate({
        path: "problemId",
      })
      .sort({ submittedAt: -1 })
      .select("status language submittedAt verdict completedAt startedAt");

    res.status(200).json(submissions);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// загрузка решений
router.get("/content/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json("Отсутствие обязательных полей");

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(400).json("Файл не найден");
    }
    const content = await fs.readFileSync(job.filepath, "utf8");
    res.status(200).json({ content });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
