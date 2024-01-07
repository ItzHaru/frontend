"use client";

import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useState, useRef, useEffect } from "react";
import { FaRegPlusSquare } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "@clerk/nextjs";

const createNewSource = gql`
  mutation (
    $name: String!
    $userId: String!
    $file: ID!
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

const deleteFile = gql`
  mutation ($id: ID!) {
    deleteSource(id: $id) {
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
                Img {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const getSource = gql`
  query Query1($slug: String!, $id: String!) {
    questions(filters: { Slug: { eq: $slug } }) {
      data {
        attributes {
          sources(filters: { Userid: { eq: $id } }) {
            data {
              id
              attributes {
                Name
                categories {
                  data {
                    attributes {
                      Name
                      Color
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const urlSource = gql`
  query ($id: [ID]!) {
    sources(filters: { id: { in: $id } }) {
      data {
        id
        attributes {
          Files {
            data {
              attributes {
                url
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
  const { user, isSignedIn } = useUser();

  const { data, loading } = useQuery(getQuestionDetailsQuery, {
    variables: { slug: params.questionSlug },
  });

  const [getSources, { data: sources, loading: loadsources }] =
    useLazyQuery(getSource);

  useEffect(() => {
    if (user?.id) {
      getSources({ variables: { slug: params.questionSlug, id: user.id } });
    }
  }, [user]);

  const [delFile, { data: file4, loading: loaddelfile }] = useMutation(
    deleteFile,
    { refetchQueries: ["Query1"] }
  );

  const sourcesId = sources?.questions?.data[0].attributes.sources.data.map(
    (source) => {
      return source.id;
    }
  );

  const { data: urls, loading: loadurlsource } = useQuery(urlSource, {
    variables: { id: sourcesId },
    skip: sourcesId == undefined,
  });

  useEffect(() => {
    console.log(file);
  }, [file]);

  const [upload] = useMutation(createNewSource, { refetchQueries: ["Query1"] });
  const [uploadFile1] = useMutation(uploadFile);

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  function onFileAddClick(e) {
    if (dialogRef === null) return;
    dialogRef.current.showModal();
  }

  function onFileUpload(e) {
    const file1 = e.target.files[0];
    setFile(file1);
  }

  function downloadURI(uri, name) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
  }

  async function onFileSubmit(e) {
    if (!file || !selectedCategory) return;
    if (!isSignedIn) return;
    const file2 = await uploadFile1({
      variables: {
        file: fileImportRef.current.files[0],
      },
    });
    const data3 = await upload({
      variables: {
        name: file.name,
        userId: user.id,
        file: file2.data.upload.data.id,
        categoriesId: selectedCategory.id,
        questionId: data.questions.data[0].id,
      },
    });
    dialogRef.current.close();
  }

  if (loading) {
    return <p>Loading your data ...</p>;
  }

  if (loadsources) {
    return <p>Loading sources ...</p>;
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
                    {((question.id - 1) % 25) + 1}. {question.attributes.Name}
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
                        {item.attributes.Img.data.map((image) => {
                          return (
                            <img
                              src={`http://localhost:1337${image.attributes.url}`}
                              alt=""
                            />
                          );
                        })}
                      </ul>
                    );
                  })}
                  <h2 className="text-[#E2E8F0] text-xl mt-10 mb-2">Zdroje:</h2>
                  {sources?.questions.data.map((question, index) => {
                    return question.attributes.sources.data.map(
                      (source, index) => {
                        const tag =
                          source.attributes.categories.data[0].attributes;
                        return (
                          <ul key={index} className="list-disc pl-5">
                            <li>
                              <button
                                type="button"
                                onClick={() => {
                                  downloadURI(
                                    urls[index],
                                    source.attributes.Name
                                  );
                                }}
                              >
                                {source.attributes.Name}
                              </button>
                              <div className="ml-2 inline-flex h-8">
                                <div
                                  className="relative py-1 px-2 w-fit h-full text-white rounded-l-sm"
                                  style={{ backgroundColor: tag.Color }}
                                >
                                  {tag.Name}
                                </div>
                                <div
                                  className="h-full w-6 ml-[-1px]"
                                  style={{
                                    backgroundColor: tag.Color,
                                    WebkitMaskImage:
                                      "radial-gradient(circle at 30% center, transparent 20%, white 20%)",
                                    clipPath: "polygon(0 0, 0 100%, 100% 50%)",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    delFile({ variables: { id: source.id } });
                                  }}
                                >
                                  <RxCross2 className="ml-2 text-2xl mt-1" />
                                </button>
                              </div>
                            </li>
                          </ul>
                        );
                      }
                    );
                  })}
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
