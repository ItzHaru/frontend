import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import { useState } from "react-dom";

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
          subquestions {
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

export default async function Page({ params }) {
  const client = getClient();
  const { data } = await client.query({
    query: getQuestionDetailsQuery,
    variables: { slug: params.questionSlug },
    //fetchPolicy: "no-cache",
  });

  return (
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
            <p>
              <input
                type="file"
                name="zdroj-ucitelu"
                value=""
                accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                //onChange={(e) => setSomething(e.target.value)}
              />
            </p>
            <h2 className="text-[#E2E8F0] text-xl mt-10 mb-2">Moje zdroje:</h2>
            <p>
              <input type="file" name="moje-zdroje" value="" />
            </p>
          </div>
        );
      })}
    </div>
  );
}
