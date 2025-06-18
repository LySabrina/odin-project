import "../styles/CV.scss";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import GeneralInfo from "./GeneralInfo.jsx";
import SkillInfo from "./SkillInfo.jsx";
import Section from "./Section.jsx";
import SectionInfo from "./SectionInfo.jsx";

function CV({ preview }) {
  const [sections, setSections] = useState([
    {
      title: "Experience",
      id: uuid(),
    },
    { title: "Projects", id: uuid() },
  ]);

  const handleDeleteSection = (id) => {
    const newSections = sections.filter((elem) => elem.id != id);
    setSections(newSections);
  };

  const handleChangeSectionName = (title, id) => {
    const newSections = sections.map((elem) => {
      if (elem.id == id) {
        elem.title = title;
      }
    });
  };

  return (
    <div className="container">
      <GeneralInfo preview={preview} />
      <SkillInfo preview={preview} />

      {sections.map((elem) => {
        return (
          <Section
            preview={preview}
            title={elem.title}
            key={elem.id}
            id={elem.id}
            handleDeleteSection={handleDeleteSection}
          />
        );
      })}
    </div>
  );
}

export default CV;
