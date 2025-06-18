import { useState } from "react";
import "../styles/GeneralInfo.scss";

function GeneralInfo({ preview }) {
  const [info, setInfo] = useState({
    name: "Name",
    number: "(123) 456 - 789",
    email: "email@example.com",
    links: ["link1", "link2"],
  });
  const [prevInfo, setPrevInfo] = useState(info);

  const [isEdit, setIsEdit] = useState(false);

  const openEditMode = () => {
    setIsEdit(true);
  };

  const cancelEditMode = () => {
    setInfo(prevInfo);
    setIsEdit(false);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setPrevInfo(info);
    setIsEdit(false);
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInfo((prev) => {
      return { ...prev, [name]: name == "links" ? [] : value };
    });
  };

  return (
    <div className="general-info">
      {!isEdit ? (
        <>
          <h1 className="general-info__name">{info.name}</h1>
          <ul className="general-info__list">
            <li className="general-info__list-item">{info.number}</li>
            <li className="general-info__list-item">{info.email}</li>

            {info.links.map((item, index) => {
              return (
                <li className="general-info__list-item" key={index}>
                  {item}
                </li>
              );
            })}
          </ul>
          {!preview && <button className="general-info__edit" onClick={openEditMode}>Edit</button>}
        </>
      ) : (
        <>
          <form className="form" onSubmit={handleOnSubmit}>
            <input
              className="general-info__name"
              type="text"
              name="name"
              value={info.name}
              onChange={(e) => handleOnChange(e)}
            />
            <ul className="general-info__list">
              <li className="general-info__list-item">
                <input
                  type="tel"
                  name="number"
                  value={info.number}
                  onChange={(e) => handleOnChange(e)}
                />
              </li>
              <li className="general-info__list-item">
                <input
                  type="email"
                  name="email"
                  value={info.email}
                  onChange={(e) => handleOnChange(e)}
                />
              </li>
              {info.links.map((item) => {
                return (
                  <li className="general-info__list-item" key={item}>
                    <input
                      type="text"
                      name="links"
                      value={item}
                      onChange={(e) => handleOnChange(e)}
                    />
                    <button type="button">Delete Link</button>
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={cancelEditMode}>
              Cancel
            </button>

            <button>Save</button>
          </form>
        </>
      )}
    </div>
  );
}
export default GeneralInfo;
