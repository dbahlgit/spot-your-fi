export function Profile(props) {
  if (props.profile === undefined) {
    return <div>Try to login</div>;
  }
  props = props.profile;
  console.log(props);
  return (
    <section id="profile">
      <h2>
        Logged in as <span id="displayName">{props.display_name}</span>
      </h2>
      <span id="avatar">
        {props.images.length > 0 ? (
          <img
            height={props.images[0].height}
            width={props.images[0].width}
            src={props.images[0].url}
            alt=""
          />
        ) : (
          <></>
        )}
      </span>
      <ul>
        <li>
          User ID: <span id="id">{props.id}</span>
        </li>
        <li>
          Email: <span id="email">{props.email}</span>
        </li>
        <li>
          Spotify URI:{" "}
          <a id="uri" href={props.external_urls.spotify}>
            {props.external_urls.spotify}
          </a>
        </li>
        <li>
          Link:{" "}
          <a id="url" href={props.href}>
            {props.href}
          </a>
        </li>
      </ul>
    </section>
  );
}
