import { Table } from "@nextui-org/react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  asyncSubmissionContent,
  setSubmissionId,
} from "../store/submissionSlice";
import { UserSubmissionType } from "../utils/type";
import ShowSubmission from "./ShowSubmission";

export default function AllSubmission({
  submissions,
  all = false,
}: {
  submissions: UserSubmissionType[];
  all?: boolean;
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.code.loading);

  const dispatch = useDispatch();

  const handleCodeFetch = (sub: UserSubmissionType) => {
    dispatch(asyncSubmissionContent((sub as any)._id) as any);
    dispatch(setSubmissionId(sub as any) as any);
  };

  if (!user && !all)
    return (
      <div className="grid place-items-center">
        <h1 className="text-3xl">Войдите, чтобы увидеть предыдущие отправленные решения</h1>
      </div>
    );

  return (
    <div className="max-w-6xl m-auto">
      {!all && user && (
        <h3 className="text-gray-600 mb-4">
          Ответы пользователя {user.displayName + ""}
        </h3>
      )}
      {loading ? (
        <Loading />
      ) : submissions.length ? (
        <>
          <Table
            lined
            shadow
            aria-label="All submissions"
            css={{ height: "auto", minWidth: "100%" }}
            className="table-auto w-full border shadow rounded"
          >
            <Table.Header>
              <Table.Column
                css={{
                  fontSize: "$lg",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  color: "$gray800",
                  fontFamily: "Mukta",
                }}
              >
                Время отправки
              </Table.Column>
              <Table.Column
                css={{
                  fontSize: "$lg",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  color: "$gray800",
                  fontFamily: "Mukta",
                }}
              >
                Имя пользователя
              </Table.Column>
              <Table.Column
                css={{
                  fontSize: "$lg",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  color: "$gray800",
                  fontFamily: "Mukta",
                }}
              >
                Задача
              </Table.Column>
              <Table.Column
                css={{
                  fontSize: "$lg",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  color: "$gray800",
                  fontFamily: "Mukta",
                }}
              >
                Статус решения
              </Table.Column>
              <Table.Column
                css={{
                  fontSize: "$lg",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  color: "$gray800",
                  fontFamily: "Mukta",
                }}
              >
                Время запуска
              </Table.Column>
              <Table.Column
                css={{
                  fontSize: "$lg",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  color: "$gray800",
                  fontFamily: "Mukta",
                }}
              >
                Язык программирования
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {submissions.map((submission, index) => (
                <Table.Row key={index}>
                  <Table.Cell
                    css={{
                      fontFamily: "Ubuntu Mono",
                      paddingTop: "12px",
                      fontSize: "18px",
                      paddingBottom: "12px",
                    }}
                  >
                    {moment(submission.submittedAt).format("LLL")}
                  </Table.Cell>
                  <Table.Cell
                    css={{
                      fontFamily: "Ubuntu Mono",
                      paddingTop: "12px",
                      fontSize: "18px",
                      paddingBottom: "12px",
                    }}
                  >
                    {submission.userId?.email}
                  </Table.Cell>
                  <Table.Cell
                    css={{
                      fontFamily: "Ubuntu Mono",
                      paddingTop: "12px",
                      fontSize: "18px",
                      paddingBottom: "12px",
                    }}
                  >
                    {submission.problemId?.slug}
                  </Table.Cell>
                  <Table.Cell
                    css={{
                      fontFamily: "Ubuntu Mono",
                      paddingTop: "12px",
                      fontSize: "18px",
                      paddingBottom: "12px",
                    }}
                  >
                    <button
                      className={`${
                        submission.status === "in queue" ||
                        submission.status === "running"
                          ? "text-blue-600" // Синий цвет для статусов "в очереди" и "выполняется"
                          : submission.verdict === "ac"
                          ? "text-green-600" // Зеленый цвет для "Принято"
                          : "text-red-600" // Красный цвет для других статусов
                      } font-bold underline cursor-pointer`}
                      onClick={() => handleCodeFetch(submission)}
                    >
                      <span className="capitalize">
                        {renderStatus(submission)}
                      </span>
                    </button>
                  </Table.Cell>
                  <Table.Cell
                    css={{
                      fontFamily: "Ubuntu Mono",
                      paddingTop: "12px",
                      fontSize: "18px",
                      paddingBottom: "12px",
                    }}
                  >
                    {moment(submission.completedAt).diff(
                      moment(submission.startedAt),
                      "seconds",
                      true
                    ) / 2}
                  </Table.Cell>
                  <Table.Cell
                    css={{
                      fontFamily: "Ubuntu Mono",
                      paddingTop: "12px",
                      fontSize: "18px",
                      paddingBottom: "12px",
                    }}
                  >
                    {renderLanguage(submission.language)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Pagination
              color={"secondary"}
              shadow
              noMargin
              align="center"
              rowsPerPage={12}
              onPageChange={(page) => console.log({ page })}
            />
          </Table>
          <ShowSubmission />
        </>
      ) : (
        <div>
          <p className="font-mono text-lg">Не найлено  предыдущих отправленных ответов.</p>
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="border border-blue-300 shadow rounded-md p-4">
      <div className="flex animate-pulse w-full justify-between">
        <div className="w-[23%] h-3 rounded bg-slate-700"></div>
        <div className="w-[23%] h-3 rounded bg-slate-700"></div>
        <div className="w-[23%] h-3 rounded bg-slate-700"></div>
        <div className="w-[23%] h-3 rounded bg-slate-700"></div>
      </div>
      <div className="flex animate-pulse w-full justify-between mt-4">
        <div className="w-[23%] h-2 rounded bg-slate-700"></div>
        <div className="w-[23%] h-2 rounded bg-slate-700"></div>
        <div className="w-[23%] h-2 rounded bg-slate-700"></div>
        <div className="w-[23%] h-2 rounded bg-slate-700"></div>
      </div>
      <div className="flex animate-pulse w-full justify-between mt-4">
        <div className="w-[23%] h-2 rounded bg-slate-700"></div>
        <div className="w-[23%] h-2 rounded bg-slate-700"></div>
        <div className="w-[23%] h-2 rounded bg-slate-700"></div>
        <div className="w-[23%] h-2 rounded bg-slate-700"></div>
      </div>
    </div>
  );
}

function renderLanguage(language: string) {
  switch (language) {
    case "cpp":
      return "C++";
    case "c":
      return "C";
    case "py":
      return "Python";
    case "java":
      return "Java";
    default:
      return language;
  }
}

function renderStatus(submission: { status?: string; verdict?: string }) {
  if (submission.status === "c_error") {
    return "Ошибка компиляции";
  } else if (submission.status === "r_error") {
    return "Ошибка Runtime";
  } else if (submission.status === "success") {
    switch (submission.verdict) {
      case "ac":
        return "Принято";
      case "wa":
        return "Неправильный ответ";
      default:
        return "Превышение лимита времени";
    }
  } else {
    return submission.status; // для других статусов
  }
}
