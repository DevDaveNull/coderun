const { spawn } = require("child_process");
const path = require("path");

const executePy = (filepath, userInput) => {
  return new Promise((resolve, reject) => {
    const execute = spawn("python3", [filepath]);

    // Если нужно отправить входные данные в скрипт Python, можно написать в stdin
    execute.stdin.write(userInput);
    execute.stdin.end();

    let output = "";
    let errorOutput = ""; // Переменная для хранения сообщений об ошибках

    // Обработка вывода сценария Python
    execute.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Обработка вывода ошибок
    execute.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    // Работа с ошибками
    execute.on("error", (err) => {
      reject({ type: "r_error", message: err.message });
    });

    // Обработка завершения дочернего процесса
    execute.on("close", (code) => {
      if (code !== 0) {
        // Non-zero exit code indicates an error
        reject({
          type: "r_error",
          message: `Execution Failed:\n${
            errorOutput || "Unknown runtime error"
          }`,
        });
      } else {
        resolve(output); // Выполнение прошло успешно, разрешите вывод
      }
    });
  });
};

module.exports = {
  executePy,
};
