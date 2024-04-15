import { Loading } from "@nextui-org/react";
import MDEditor from "@uiw/react-md-editor";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import rehypeSanitize from "rehype-sanitize";
import TestcaseContainer from "../components/TestcaseContainer";
import TestcaseModal from "../components/TestcaseModal";
import {
  asyncProblemAdd,
  asyncProblemEdit,
  setTestcase,
} from "../store/ProblemSlice";
import { RootState } from "../store/store";

export default function AddProblem() {
  const user = useSelector((state: RootState) => state.auth.user);
  const problem = useSelector(
    (state: RootState) => state.problem.singleProblem
  );
  const [problemDetail, setProblemDetail] = useState({
    slug: "",
    title: "",
    desc: "",
    statement: "",
    input: "",
    output: "",
    constraints: "",
  });
  const testcase = useSelector((state: RootState) => state.problem.testcase);
  const loading = useSelector((state: RootState) => state.problem.loading);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [editDetails, setEditDetails] = useState({
    edit: searchParams.get("edit"),
    problemId: searchParams.get("problemId"),
  });

  useEffect(() => {
    if (editDetails.edit === "true" && editDetails.problemId && problem) {
      setProblemDetail({
        slug: problem?.slug,
        title: problem?.title,
        desc: problem?.desc,
        statement: problem?.statement,
        input: problem?.input,
        output: problem?.output,
        constraints: problem?.constraints,
      });
      if (problem.testcase) dispatch(setTestcase(problem.testcase));
    }
  }, [editDetails, problem]);

  console.log(problem);

  const handleAdd = async () => {
    // здесь обработка задачи
    if (problem && editDetails.edit === "true" && editDetails.problemId) {
      dispatch(
        asyncProblemEdit({
          detail: problemDetail,
          testcase,
          id: problem._id,
        }) as any
      );
      return;
    }

    // Обработчик добавления задачи
    if (!user) {
      toast.error("Зарегистрируйтесь, чтобы добавлять задания");
      return;
    }
    if (testcase.length === 0) {
      toast.error("Вы хотите добавить тест кейс");
      return;
    }
    let sample = 0,
      notSample = 0;
    testcase.forEach((item) => {
      if (item.sample) sample++;
      else notSample++;
    });
    if (sample && notSample)
      dispatch(asyncProblemAdd({ detail: problemDetail, testcase }) as any);
    else toast.error("Вы должны добавить по крайней мере один пользовательский тест-кейс");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto font-mono my-4">
        <h1 className="text-4xl">
          {problem && editDetails.edit === "true" && editDetails.problemId
            ? "Изменить"
            : "Создать"}{" "}
          Задачу
        </h1>
        {problem && editDetails.edit === "true" && editDetails.problemId ? (
          ""
        ) : (
          <p className="text-sm italic text-gray-500 my-2">
            Начните с предоставления исходных данных, необходимых для создания задачи.
          </p>
        )}

        {/* Описание детальное*/}
        <div className="mt-8 space-y-8">
          <div className="flex">
            <p className="w-48 min-w-fit">Описание задачи</p>
            <input
              value={problemDetail.slug}
              onChange={(e) =>
                setProblemDetail({ ...problemDetail, slug: e.target.value })
              }
              type="text"
              className="flex-grow outline-none border-2 border-gray-400 p-2 rounded-sm shadow"
              required
              placeholder="Напишите название задачи, например Number123 (должно быть уникальным)."
            />
          </div>
          <div className="flex">
            <p className="w-48 min-w-fit">Тема задачи</p>
            <input
              value={problemDetail.title}
              onChange={(e) =>
                setProblemDetail({ ...problemDetail, title: e.target.value })
              }
              type="text"
              className="flex-grow outline-none border-2 border-gray-400 p-2 rounded-sm shadow"
              required
              placeholder="Напишите тему задачи"
            />
          </div>
          <div className="flex items-start">
            <p className="w-48 min-w-fit">Описание</p>
            <textarea
              value={problemDetail.desc}
              onChange={(e) =>
                setProblemDetail({ ...problemDetail, desc: e.target.value })
              }
              rows={4}
              required
              className="flex-grow outline-none border-2 border-gray-400 p-2 rounded-sm shadow"
              placeholder="Напишите краткую информацию о задаче."
            />
          </div>
          <div className="flex items-start">
            <p className="w-48 min-w-fit">Постановка задачи</p>
            <div className="flex-grow max-w-[880px]">
              <MDEditor
                value={problemDetail.statement}
                onChange={(e) =>
                  setProblemDetail({ ...problemDetail, statement: e as string })
                }
                preview="edit"
              />
            </div>
          </div>
          <div className="flex items-start">
            <p className="w-48 min-w-fit">Формат ввода</p>
            <div className="flex-grow  max-w-[880px]">
              <MDEditor
                value={problemDetail.input}
                onChange={(e) =>
                  setProblemDetail({ ...problemDetail, input: e as string })
                }
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                preview="edit"
              />
            </div>
          </div>
          <div className="flex items-start">
            <p className="w-48 min-w-fit">Формат вывода</p>
            <div className="flex-grow  max-w-[880px]">
              <MDEditor
                value={problemDetail.output}
                onChange={(e) =>
                  setProblemDetail({ ...problemDetail, output: e as string })
                }
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                preview="edit"
              />
            </div>
          </div>
          <div className="flex items-start">
            <p className="w-48 min-w-fit">Ограничения</p>
            <div className="flex-grow  max-w-[880px]">
              <MDEditor
                value={problemDetail.constraints}
                onChange={(e) =>
                  setProblemDetail({
                    ...problemDetail,
                    constraints: e as string,
                  })
                }
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                preview="edit"
              />
            </div>
          </div>
        </div>

        {/* Тест кейс для задачи */}
        <div className="w-full mt-8">
          <TestcaseContainer />
        </div>
      </div>
      <div className="sticky bottom-0 flex items-center justify-end p-4 z-50 border shadow bg-[whitesmoke] space-x-4">
        {loading ? (
          <div className="mr-10">
            <Loading type="points" />
          </div>
        ) : (
          <>
            <TestcaseModal />
            <button
              className="outline-none border shadow bg-slate-700 text-gray-200 rounded-sm font-mono font-semibold px-5 py-2 hover:bg-slate-600"
              onClick={handleAdd}
            >
              {problem && editDetails.edit === "true" && editDetails.problemId
                ? "Изменить"
                : "ОК"}
            </button>
          </>
        )}
      </div>
    </>
  );
}
