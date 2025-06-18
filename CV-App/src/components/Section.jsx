import { useState } from "react";
import SectionInfo from "./SectionInfo.jsx";
import { v4 as uuid } from "uuid";

function Section({ title, id, handleDeleteSection, preview }) {
  const [sectionInfos, setSectionInfos] = useState([
    {
      title: "Title",
      company: "Company",
      location: "location",
      startDate: "Jun 2024",
      endDate: "Sep 2024",
      list: [
        {
          value: "Point 1",
          id: uuid(),
        },
        {
          value: "Point 2",
          id: uuid(),
        },
      ],

      id: uuid(),
    },
    {
      title: "Title",
      company: "Company",
      location: "location",
      startDate: "Jun 2024",
      endDate: "Sep 2024",
      list: [
        {
          value: "Point 1",
          id: uuid(),
        },
        {
          value: "Point 2",
          id: uuid(),
        },
      ],

      id: uuid(),
    },
  ]);

  const updateSectionInfo = (sectionInfo) => {
    console.log("updated");
    const id = sectionInfo.id;

    const updated = sectionInfos.map((elem) => {
      if (elem.id == id) {
        return sectionInfo;
      } else {
        return elem;
      }
    });
    setSectionInfos(updated);
  };

  return (
    <div className="section">
      <h2 className="section__title">{title}</h2>

      {!preview && (
        <button
          onClick={() => {
            handleDeleteSection(id);
          }}
        >
          Delete Section
        </button>
      )}

      <div className="section__list-items">
        {sectionInfos.map((element) => (
          <SectionInfo
            {...element}
            preview={preview}
            key={element.id}
            updateSectionInfo={updateSectionInfo}
          />
        ))}
      </div>
    </div>
  );
}
export default Section;
