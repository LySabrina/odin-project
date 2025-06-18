import { useState } from "react";
import { v4 as uuid } from "uuid";
import "../styles/_SkillInfo.scss";
function SkillInfo({ preview }) {
  const [skills, setSkills] = useState([
    {
      value: "React",
      id: uuid(),
    },
    {
      value: "Javascript",
      id: uuid(),
    },
    {
      value: "Sass",
      id: uuid(),
    },
  ]);
  const [prevInfo, setPrevInfo] = useState(skills);
  const [isEdit, setIsEdit] = useState(false);

  const openEditMode = () => {
    setIsEdit(true);
  };

  const closeEditMode = () => {
    setSkills(prevInfo);
    setIsEdit(false);
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const id = e.target.dataset.id;
    const newArr = skills.map((elem) => {
      if (elem.id == id) {
        elem.value = value;
      }
      return elem;
    });

    setSkills(newArr);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setIsEdit(false);
    setPrevInfo(skills);
  };

  const handleAddSkill = (e) => {
    const target = e.target.previousElementSibling;
    const value = target.value;
    if (value == "") {
      alert("Empty Skill");
      return;
    }
    setSkills((prevSkills) => {
      return [...prevSkills, { value: value, id: uuid() }];
    });
  };

  const handleDeleteSkills = (e) => {
    const target = e.target.previousElementSibling;
    const id = target.dataset.id;
    const filter = skills.filter((elem) => {
      if (elem.id != id) {
        return elem;
      }
    });

    setSkills(filter);
  };

  return (
    <div className="skill-info">
      <h2>Skills:</h2>
      {!isEdit ? (
        <>
          <ul className="skill-info__list">
            {skills.map((elem, index) => {
              return index == skills.length - 1 ? (
                <li className="skill-info__list-item" key={elem.id}>
                  {elem.value}
                </li>
              ) : (
                <li className="skill-info__list-item" key={elem.id}>
                  {elem.value},
                </li>
              );
            })}
          </ul>
          {!preview && (
            <button className="skill-info__edit" onClick={openEditMode}>
              Edit
            </button>
          )}
        </>
      ) : (
        <>
          <form onSubmit={handleOnSubmit} className="skill-info__form">
            {skills.map((elem) => {
              return (
                <div className="skill-info__form-group" key={elem.id}>
                  <input
                    type="text"
                    name="skills"
                    data-id={elem.id}
                    value={elem.value}
                    onChange={handleOnChange}
                  />
                  <button type="button" onClick={handleDeleteSkills}>
                    Delete Skill
                  </button>
                </div>
              );
            })}
            <div className="skill-info__form-group">
              <input type="text" name="add" placeholder="Add more skills" />
              <button type="button" onClick={handleAddSkill}>
                Add
              </button>
            </div>

            <div className="skill-info__form-btns">
              <button type="button" onClick={closeEditMode}>
                Cancel
              </button>
              <button>Save</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default SkillInfo;
