"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useRef, useEffect } from "react";
import { FaRegPlusSquare } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { data } from "autoprefixer";

const createNewSource = gql`
  mutation (
    $name: String!
    $userId: String!
    $file: Upload!
    $categoriesId: [ID]!
    $questionId: ID
  ) {
    createSource(
      data: {
        Name: $name
        Userid: $userId
        publishedAt: "2007-12-03T10:15:30Z"
        categories: $categoriesId
        question: $questionId
        Files: $file
      }
    ) {
      data {
        id
      }
    }
  }
`;

const uploadFile = gql`
  mutation ($file: Upload!) {
    upload(file: $file) {
      data {
        id
      }
    }
  }
`;

const query = gql`
  query {
    questions {
      data {
        attributes {
          Slug
        }
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query {
    categories {
      data {
        id
        attributes {
          Name
        }
      }
    }
  }
`;

const getQuestionDetailsQuery = gql`
  query Query($slug: String!) {
    questions(filters: { Slug: { eq: $slug } }) {
      data {
        id
        attributes {
          Name
          Slug
          subquestions(pagination: { limit: 150 }) {
            data {
              attributes {
                Name
              }
            }
          }
          tasks {
            data {
              attributes {
                Name
              }
            }
          }
        }
      }
    }
  }
`;

export default function Page({ params }) {
  const dialogRef = useRef(null);
  const fileImportRef = useRef(null);
  const [file, setFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data, loading } = useQuery(getQuestionDetailsQuery, {
    variables: { slug: params.questionSlug },
  });

  const { user, isSignedIn } = useUser();
  useEffect(() => {
    console.log(file);
  }, [file]);

  const [upload] = useMutation(createNewSource);

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  console.log(categoriesData);

  function onFileAddClick(e) {
    if (dialogRef === null) return;
    dialogRef.current.showModal();
  }

  function onFileUpload(e) {
    const file1 = e.target.files[0];
    setFile(file1);
  }

  async function onFileSubmit(e) {
    if (!file || !selectedCategory) return;
    if (!isSignedIn) return;
    const data = upload({
      variables: {
        file: fileImportRef.current.files[0],
        name: file.name,
        userId: user.id,
        categoriesId: selectedCategory.id,
        questionId: data.questions.data[0].id,
      },
    });
    console.log(data);
  }

  if (loading) {
    return <p>Loading your data ...</p>;
  }

  return (
    <div>
      <dialog ref={dialogRef} className="relative w-full bg-transparent">
        <form className="max-w-[600px] mx-auto rounded-lg shadow-md p-4 bg-slate-100">
          <input
            ref={fileImportRef}
            onInput={(e) => onFileUpload(e)}
            type="file"
            name="zdroj-ucitelu"
            accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <select
            name="category"
            id="category"
            onChange={(e) => {
              const category = categoriesData.categories.data.find(
                (item) => item.attributes.Name === e.target.value
              );
              if (!category) return;
              setSelectedCategory(category);
            }}
          >
            <option selected disabled>
              Select category
            </option>
            {categoriesData !== undefined &&
              categoriesData.categories.data.map((item) => {
                return (
                  <option key={item.id} value={item.attributes.Name}>
                    {item.attributes.Name}
                  </option>
                );
              })}
          </select>
          {categoriesData !== undefined &&
            categoriesData.categories.data.map((item) => {
              <div key={item.id} value={item.attributes.Name}>
                {item.attributes.Name}
              </div>;
            })}
          <button type="button" onClick={onFileSubmit}>
            Submit
          </button>
        </form>
      </dialog>
      <div>
        {data && (
          <div className="p-6">
            {data.questions.data.map((question) => {
              return (
                <div key={question.slug} className="px-5">
                  <h3 className="text-[#E2E8F0] text-3xl mb-2">
                    {question.attributes.Name}
                  </h3>
                  {question.attributes.subquestions.data.map((item, index) => {
                    return (
                      <ul key={index} className="list-disc pl-5">
                        <li>{item.attributes.Name}</li>
                      </ul>
                    );
                  })}
                  {question.attributes.tasks.data.length > 0 && (
                    <h2 className="text-[#E2E8F0] text-xl mt-10 mb-2">
                      Praktické úkoly
                    </h2>
                  )}

                  {question.attributes.tasks.data.map((item, index) => {
                    return (
                      <ul key={index} className="list-disc pl-5">
                        <li>{item.attributes.Name}</li>
                      </ul>
                    );
                  })}
                  <h2 className="text-[#E2E8F0] text-xl mt-10 mb-2">
                    Zdroje učitelů:
                  </h2>
                  <button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={onFileAddClick}
                  >
                    <FaRegPlusSquare /> Přidat soubor
                  </button>
                  <h2 className="text-[#E2E8F0] text-xl mt-10 mb-2">
                    Moje zdroje:
                  </h2>
                  <button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={onFileAddClick}
                  >
                    <FaRegPlusSquare /> Přidat soubor
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
