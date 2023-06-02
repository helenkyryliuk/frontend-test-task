import { Auth0ContextInterface } from "@auth0/auth0-react";
import React, { useEffect, useState, Fragment } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import authConfig from "../auth_config.json";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { Card, Form, ListGroup } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface FilterProps {
  auth0: Auth0ContextInterface;
}

interface SynopsisData {
  colType: string;
  numRows: number;
  numUniqueValues: number;
  sample: Array<String>;
  sampleHeader: string;
}

function Filter(props: FilterProps) {
  const { auth0 } = props;
  const { isAuthenticated } = auth0;

  const [isLoading, setIsLoading] = useState(false);
  const [responseError, setResponseError] = useState<string>();
  const [data, setData] = useState<Array<SynopsisData>>([]);
  const [filterItems, setFilterItems] = useState([
    { name: "Example filter", type: "Default", id: 1 },
  ]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      const url = `${authConfig.apiBase}/synopsis`;
      const getAccessTokenSilently = await auth0.getAccessTokenSilently();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessTokenSilently}`,
        },
      });

      if (!response.ok) {
        const error = `An error has occured: ${response.status}`;
        setResponseError(error);
        return;
      }

      const { data } = await response.json();
      setData(data.columns);
      setIsLoading(false);
    };

    if (isAuthenticated) {
      getData();
    }
  }, [auth0, isAuthenticated]);

  const onClickAddFilterItem = (filterName: string, index: number) => {
    setFilterItems((prevState) => {
      return [...prevState, { name: filterName, type: "Default", id: index }];
    });
  };

  const onDelete = (filterName: string) => {
    const updatedItems = filterItems.filter((item) => item.name !== filterName);
    setFilterItems(updatedItems);
  };

  const onSave = () => {
    const dataToDisplay = filterItems.map((item) => {
      return JSON.stringify(item);
    });
    window.alert(dataToDisplay.toString());
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const schemaCopy = filterItems.slice();
    const [removed] = schemaCopy.splice(result.source.index, 1);
    schemaCopy.splice(result.destination.index, 0, removed);

    setFilterItems(schemaCopy);
  };

  const onChangeFilterType = (e: any, id: number) => {
    const updatedItems = filterItems.map((item) => {
      console.log(e.target.value, item, id);
      return item.id === id ? { ...item, type: e.target.value } : item;
    });
    setFilterItems(updatedItems);
  };

  return (
    <div className="d-flex mr-5 ml-5 mt-2 flex-column">
      {responseError && (
        <div className="m-auto">
          We couldn't display filter items at this time. Please, try again
          later.
        </div>
      )}
      {isLoading ? (
        <div className="m-auto">Loading ...</div>
      ) : (
        <Fragment>
          <div className="d-flex flex-column mr-5 ml-5">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="column1">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {filterItems.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`${item.id}`}
                        index={index}
                      >
                        {(provided, snap) => (
                          <Card
                            className="m-1"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              backgroundColor: snap.isDragging
                                ? "#4fe"
                                : "#eee",

                              ...provided.draggableProps.style,
                            }}
                          >
                            <Card.Body className="m-1 p-2">
                              <div className="d-flex justify-content-between">
                                <div className="d-flex align-items-center">
                                  {item.name} Type
                                  <Form.Select
                                    aria-label="Default select example"
                                    onChange={(e) =>
                                      onChangeFilterType(e, item.id)
                                    }
                                    defaultValue={item.type}
                                  >
                                    <option value={"Default"}>Default</option>
                                    <option value="Search">Search</option>
                                    <option value="Date">Date</option>
                                    <option value="Score">Score</option>
                                  </Form.Select>
                                </div>
                                <Button
                                  variant="danger"
                                  onClick={() => onDelete(item.name)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className="mr-5 ml-5">
            <Dropdown className="m-1" as={ButtonGroup}>
              <Button variant="info">Add filter</Button>
              <Dropdown.Toggle split variant="info" id="dropdown-split-basic" />
              <Dropdown.Menu className="dropdown-menu">
                {data?.map((item, index) => (
                  <OverlayTrigger
                    trigger="hover"
                    placement="right"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">Sample data</Popover.Header>
                        <Popover.Body>
                          <ListGroup>
                            {item.sample.map((item) => (
                              <ListGroup.Item>{item}</ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Dropdown.Item
                      onClick={() =>
                        onClickAddFilterItem(item.sampleHeader, index)
                      }
                    >
                      {item.sampleHeader}
                    </Dropdown.Item>
                  </OverlayTrigger>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="text-right">
            <Button variant="primary" onClick={onSave}>
              Save
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default Filter;
