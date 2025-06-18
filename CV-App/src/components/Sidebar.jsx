import "../styles/Sidebar.scss";
function Sidebar({ setPreview }) {
  function showPrint() {
    window.print();
  }
  return (
    <div className="sidebar">
      <button
        onClick={() => {
          setPreview((prevVal) => !prevVal);
        }}
      >
        Preview
      </button>
      <button
        onClick={() => {
          showPrint();
        }}
      >
        Print
      </button>
    </div>
  );
}

export default Sidebar;
