"use client";

import { gql, useQuery, useMutation } from "@apollo/client";

const createNewSource = gql`
  mutation (
    $name: String!
    $userId: String!
    $files: Upload!
    $categoriesId: [String]!
    $questionId: String!
  ) {
    createSource(
      data: {
        Name: $name
        Userid: $userId
        publishedAt: "2007-12-03T10:15:30Z"
        categories: $categoriesId
        question: $questionId
      }
    ) {
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

const getQuestionDetailsQuery = gql`
  query Query($slug: String!) {
    questions(filters: { Slug: { eq: $slug } }) {
      data {
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
  const { data, loading } = useQuery(getQuestionDetailsQuery, {
    variables: { slug: params.questionSlug },
  });

  const { data: mutationData } = useMutation(createNewSource, {
    variables: { slug: params.questionSlug },
  });

  function onFileUpload(e) {
    const file = e.target.files;
    console.log(file, e);
  }

  if (loading) {
    return <p>Loading your data ...</p>;
  }

  return (
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
                <form>
                  <input
                    type="file"
                    name="zdroj-ucitelu"
                    accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </form>
                <h2 className="text-[#E2E8F0] text-xl mt-10 mb-2">
                  Moje zdroje:
                </h2>
                <form>
                  <input
                    type="file"
                    name="moje-zdroje"
                    onInput={onFileUpload}
                  />
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
