const Footer: React.FC = () => {
  return (
    <footer className=" text-center mt-32 text-sm">
      <p>
        {" "}
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-primary">TechInsights</span> Company LTD.. All
        rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
