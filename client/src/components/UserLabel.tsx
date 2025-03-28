import styled from "styled-components";

const Label = styled.span`
  border: 1px solid blue;
  padding: 5px;
  background: #ddddff;
`;
const UserLabel = ({ guid }: { guid?: string }) => {
  if (!guid) return false;

  return <Label>{guid}</Label>;
};

export default UserLabel;
