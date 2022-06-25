import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";
import React from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import "./FeedBackList.css";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { feedbackActions } from "../actions";

const FeedbackListSelector = (state) => state.feedback.feedbackList;

function FeedBackListReader() {
  const history = useHistory();
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const [selected, setSelected] = useState(null);
  const feedbacks = useSelector(FeedbackListSelector, shallowEqual);
  const dispatch = useDispatch();
  let emptyFeedback = {
    id: null,
    plecare: "",
    sosire: "",
    tipTransport: "",
    oraPlecare: 0,
    durata: 0,
    nivelAglomerare: "",
    detalii: "",
    gradSatisfactie: 0,
  };
  const [feedback, setFeedback] = useState(emptyFeedback);

  useEffect(() => {
    dispatch(feedbackActions.getFeedbacks());
  }, [dispatch]);

  const hideDialog = () => {
    setSubmitted(false);
    setFeedbackDialog(false);
  };

  const saveFeedback = () => {
    setSubmitted(true);
    if (feedback.plecare.trim()) {
      let _feedbacks = [...feedbacks];
      let _feedback = { ...feedback };
      if (selected) {
        const index = findIndexById(feedback.id);
        _feedbacks[index] = _feedback;
        toast.current.show({
          severity: "succes",
          summary: "Succes",
          detail: "Feedback actualizat",
          life: 3000,
        });
        console.log(feedback);
        dispatch(feedbackActions.updateFeedback(feedback, feedback.id));
      } else {
        dispatch(feedbackActions.addFeedback(feedback));
        feedback.id = createId();
        feedbacks.push(feedback);
        toast.current.show({
          severity: "succes",
          summary: "Succes",
          detail: "Feedback  creat",
          life: 3000,
        });
      }
      setFeedbackDialog(false);
      setFeedback(emptyFeedback);
      setSelected(null);
    }
  };

  const login = () => {
    history.push("/");
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < feedbacks.length; i++) {
      if (feedbacks[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };
  const onCategoryChange = (e) => {
    let _feedback = { ...feedback };
    _feedback["tipTransport"] = e.value;
    setFeedback(_feedback);
  };

  const onInputChange = (e, name) => {
    const val = e.target && e.target.value;
    let _feedback = { ...feedback };
    _feedback[`${name}`] = val;

    setFeedback(_feedback);
  };

  const header = (
    <div className="table-header">
      <h5 className="p-mx-0 p-my-1" id="title">
        Feedbacks transport
      </h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Cauta..."
        />
      </span>
    </div>
  );
  const feedbackDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveFeedback}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Menubar
        end={
          <>
            <Button icon="pi pi-fw pi-user" label="Sign In" onClick={login} />
          </>
        }
      />
      <div className="datatable-crud-demo">
        <Toast ref={toast} />
        <div className="card">
          <DataTable
            value={feedbacks}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            currentPageReportTemplate="Afiseaza {first} pana la {last} din {totalRecords} feedback-uri {first} to {last} of {totalRecords} feedbacks"
            globalFilter={globalFilter}
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              field="plecare"
              header="Plecare de la:"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="sosire"
              header="Sosire"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column field="tipTransport" header="Tip Transport"></Column>
            <Column
              field="oraPlecare"
              header="Ora plecare"
              sortable
              style={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="durata"
              header="durata"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="gradAglomerare"
              header="Grad aglomerare"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="detalii"
              header="Detalii"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="gradSatisfactie"
              header="Grad satisfactie"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        </div>

        <Dialog
          visible={feedbackDialog}
          style={{ width: "500px" }}
          header="Feedback Transport"
          modal
          className="p-fluid"
          footer={feedbackDialogFooter}
          onHide={hideDialog}
        >
          <div className="p-field">
            <label htmlFor="plecare">plecareing Station</label>
            <InputText
              id="plecare"
              value={feedback.plecare}
              onChange={(e) => onInputChange(e, "plecare")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !feedback.plecare,
              })}
            />
            {submitted && !feedback.plecare && (
              <small className="p-error">plecare is required.</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="sosire">Destination</label>
            <InputText
              id="sosire"
              value={feedback.sosire}
              onChange={(e) => onInputChange(e, "sosire")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !feedback.sosire,
              })}
            />
            {submitted && !feedback.sosire && (
              <small className="p-error">destination is required.</small>
            )}
          </div>
          <div className="p-field">
            <label className="p-mb-3">Tip Transport</label>
            <div className="p-formgrid p-grid">
              <div className="p-field-radiobutton p-col-6">
              <RadioButton
                  inputId="autobuz"
                  name="tipTransport"
                  value="Autobuz"
                  onChange={onCategoryChange}
                  checked={feedback.tipTransport === "Autobuz"}
                />
                <label htmlFor="autobuz">Autobuz</label>
              </div>
              <div className="p-field-radiobutton p-col-6">
                <RadioButton
                  inputId="tramvai"
                  name="tipTransport"
                  value="Tramvai"
                  onChange={onCategoryChange}
                  checked={feedback.tipTransport === "Tramvai"}
                />
                <label htmlFor="tramvai">Tramvai</label>
              </div>
              <div className="p-field-radiobutton p-col-6">
                <RadioButton
                  inputId="metrou"
                  name="tipTransport"
                  value="Metrou"
                  onChange={onCategoryChange}
                  checked={feedback.tipTransport === "Metrou"}
                />
                <label htmlFor="metrou">Metrou</label>
              </div>
              <div className="p-field-radiobutton p-col-6">
                <RadioButton
                  inputId="troleu"
                  name="tipTransport"
                  value="Troleu"
                  onChange={onCategoryChange}
                  checked={feedback.tipTransport === "Troleu"}
                />
              </div>
            </div>
          </div>
          <div className="p-field">
            <label htmlFor="oraPlecare">Ora plecare</label>
            <InputText
              id="oraPlecare"
              value={feedback.oraPlecare}
              onChange={(e) => onInputChange(e, "oraPlecare")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !feedback.oraPlecare,
              })}
            />
            {submitted && !feedback.oraPlecare && (
              <small className="p-error">introduceti ora plecare!</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="durata">durata</label>
            <InputText
              id="durata"
              value={feedback.durata}
              onChange={(e) => onInputChange(e, "durata")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !feedback.durata,
              })}
            />
            {submitted && !feedback.durata && (
              <small className="p-error">introduceti durata!</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="detalii">detalii</label>
            <InputTextarea
              id="detalii"
              value={feedback.detalii}
              onChange={(e) => onInputChange(e, "detalii")}
              required
              rows={3}
              cols={20}
            />
          </div>
          <div className="p-field">
            <label htmlFor="nivelAglomerare">Grad aglomerare</label>
            <InputText
              id="nivelAglomerare"
              value={feedback.nivelAglomerare}
              onChange={(e) => onInputChange(e, "nivelAglomerare")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !feedback.nivelAglomerare,
              })}
            />
            {submitted && !feedback.nivelAglomerare && (
              <small className="p-error">introduceti gradul de aglomerare!</small>
            )}
          </div>

          <div className="p-field">
            <label htmlFor="gradSatisfactie">Grad satisfactie</label>
            <InputText
              id="gradSatisfactie"
              value={feedback.gradSatisfactie}
              onChange={(e) => onInputChange(e, "gradSatisfactie")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !feedback.gradSatisfactie,
              })}
            />
            {submitted && !feedback.gradSatisfactie && (
              <small className="p-error">introduceti gradul de satisfactie!</small>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default FeedBackListReader;
