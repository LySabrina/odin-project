import { useState } from "react";
import { v4 as uuid } from "uuid";
import "../styles/_SectionInfo.scss";
function SectionInfo({
  title,
  company,
  location,
  startDate,
  endDate,
  list,
  id,
  updateSectionInfo,
  preview,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [info, setInfo] = useState({
    title: title,
    company: company,
    location: location,
    startDate: startDate,
    endDate: endDate,
    list: list,
    id: id,
  });

  const openEditMode = () => {
    setIsEdit(true);
  };

  const cancelEditMode = () => {
    setInfo({
      title: title,
      company: company,
      location: location,
      startDate: startDate,
      endDate: endDate,
      list: list,
      id: id,
    });
    setIsEdit(false);
  };

  const handleDeleteBulletPoint = (e) => {
    const input = e.target.previousElementSibling;
    const id = input.dataset.id;
    const updated = info.list.filter((elem) => elem.id != id);
    setInfo((prevInfo) => {
      return {
        ...prevInfo,
        list: updated,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSectionInfo(info);
    setIsEdit(false);
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    let updatedList;
    if (name === "list") {
      updatedList = info.list.map((elem) => {
        const id = e.target.dataset.id;
        if (elem.id == id) {
          return {
            value: value,
            id: id,
          };
        } else {
          return elem;
        }
      });
    }
    setInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: [name] == "list" ? updatedList : value,
      };
    });
  };

  const addNewBulletPoint = (e) => {
    const input = e.target.previousElementSibling;
    const value = input.value;
    if (value == "") {
      alert("EMPTY VALUE");
      return;
    }
    const newBulletPoint = {
      value: value,
      id: uuid(),
    };

    setInfo((prevInfo) => {
      return {
        ...prevInfo,
        list: [...prevInfo.list, newBulletPoint],
      };
    });
  };

  return (
    <div className="section__list-item">
      {isEdit ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={info.title}
            onChange={handleOnChange}
          />
          <input
            type="text"
            name="company"
            value={info.company}
            onChange={handleOnChange}
          />
          <input
            type="text"
            name="location"
            value={info.location}
            onChange={handleOnChange}
          />
          <input
            type="text"
            name="startDate"
            value={info.startDate}
            onChange={handleOnChange}
          />
          <input
            type="text"
            name="endDate"
            value={info.endDate}
            onChange={handleOnChange}
          />

          {info.list.map((elem) => {
            return (
              <div className="section__form-group" key={elem.id}>
                <input
                  type="text"
                  name="list"
                  value={elem.value}
                  data-id={elem.id}
                  onChange={handleOnChange}
                />
                <button type="button" onClick={handleDeleteBulletPoint}>
                  Delete
                </button>
              </div>
            );
          })}
          <div className="section__form-group">
            <input type="text" name="list" placeholder="Add New Bullet Point" />
            <button type="button" onClick={addNewBulletPoint}>
              Add
            </button>
          </div>
          <button type="button" onClick={cancelEditMode}>
            Cancel
          </button>
          <button>Save</button>
        </form>
      ) : (
        <>
          <div className="section__list-item-info">
            <span className="section__list-item-title">{title}, </span>
            <span className="section__list-item-company">{company}, </span>
            <span className="section__list-item-location">{location}, </span>
            <span className="section__list-item-date">
              {startDate} - {endDate}
            </span>
          </div>
          <ul className="section__list-item-points">
            {list.map((elem, index) => {
              return (
                <li className="section__list-item-point" key={elem.id}>
                  {elem.value}
                </li>
              );
            })}
          </ul>
          {!preview && (
            <button type="button" onClick={openEditMode}>
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
}
export default SectionInfo;
