gh auth status

$query = gh api graphql --paginate -f owner='devlooped' -f query='
query ($owner: String!, $endCursor: String) {
  organization(login: $owner) {
    sponsorshipsAsMaintainer(first: 100, after: $endCursor, includePrivate: false) {
      nodes {
        sponsorEntity {
          ... on Organization {
            id
            login
            name
            avatarUrl
            teamsUrl
          }
          ... on User {
            id
            login
            name
            avatarUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}'

$sponsors = 
    $query | 
    ConvertFrom-Json | 
    select @{ Name='nodes'; Expression={$_.data.organization.sponsorshipsAsMaintainer.nodes}} | 
    select -ExpandProperty nodes;

$organizations = $sponsors | where { $_.sponsorEntity.teamsUrl -ne $null } | select -ExpandProperty sponsorEntity;
$users = $sponsors | where { $_.sponsorEntity.teamsUrl -eq $null } | select -ExpandProperty sponsorEntity;

New-Item -Path ".github/avatars" -ErrorAction Ignore

foreach ($node in $organizations) {
  $img = iwr ($node.avatarUrl + "&s=70");
  $type = $img.Headers["Content-Type"];
  $base64 = [convert]::ToBase64String($img.Content);
  $svg = "<svg xmlns='http://www.w3.org/2000/svg' fill='none' width='37' height='37'>
	<foreignObject width='100%' height='100%'>
		<div xmlns='http://www.w3.org/1999/xhtml'>
			<style>
        img {
          border-style: none;
          border-radius: 6px;
          box-shadow: 0 0 0 1px lightgrey;
        }
			</style>
      <img width='35' height='35' src='data:$($type);base64,$($base64)' />            
		</div>
	</foreignObject>
</svg>";

  $svg | Set-Content -Path ".github/avatars/$($node.login).svg";
}

foreach ($node in $users) {
  $img = iwr ($node.avatarUrl + "&s=70");
  $type = $img.Headers["Content-Type"];
  $base64 = [convert]::ToBase64String($img.Content);
  $svg = "<svg xmlns='http://www.w3.org/2000/svg' fill='none' width='37' height='37'>
	<foreignObject width='100%' height='100%'>
		<div xmlns='http://www.w3.org/1999/xhtml'>
			<style>
        img {
          border-style: none;
          border-radius: 50% !important;
          box-shadow: 0 0 0 1px lightgrey;
        }            
			</style>
      <img width='35' height='35' src='data:$($type);base64,$($base64)' />
		</div>
	</foreignObject>
</svg>";

  $svg | Set-Content -Path ".github/avatars/$($node.login).svg";
}