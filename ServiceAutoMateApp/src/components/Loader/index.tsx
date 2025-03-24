import { LoaderContainer, LoaderDot, LoaderSpinner } from "./styled";

const Loader = () => {
  return (
    <LoaderContainer>
      <LoaderSpinner>
        <LoaderDot />
        <LoaderDot />
        <LoaderDot />
      </LoaderSpinner>
    </LoaderContainer>
  );
};
  
export default Loader;