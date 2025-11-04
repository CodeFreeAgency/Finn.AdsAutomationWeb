import './modal.css';

const Terms = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal-terms display-block" : "modal-terms display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-terms-main">
        <button type="button" className='btn-close' onClick={handleClose}></button>
        {children}
      </section>
    </div>
  );
};

export default Terms;