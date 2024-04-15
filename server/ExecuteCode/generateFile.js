const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
  // console.log("first");
  const jobId = uuid();
  const dirPath = path.join(dirCodes, jobId); // Путь к каталогу для новой папки
  try {
    await fs.promises.mkdir(dirPath, { recursive: true }); // Создаем каталог, если он не существует

    const filename = `Main.${format}`; // Имя файла теперь всегда Main.format
    const filepath = path.join(dirPath, filename); // Настройка пути к файлу

    await fs.promises.writeFile(filepath, content); // fs.promises.writeFile для асинхронного сохранения файла
    return filepath; // Возвращает полный путь к сохраненному файлу
  } catch (error) {
    console.error("Ошибка создания файла:", error);
    throw error; // При необходимости выбрасываем ошибку для дальнейшей обработки
  }
};

module.exports = {
  generateFile,
};
