# Development

Run the server with Babel CLI:

```
npm run dev
```

# Install dependencies

```
ansible-galaxy install -r requirements.yml
```

# Development

```
vagrant up
```

# Deploying

```
ansible-playbook -i hosts ansible/deploy.yml
```

# Migrations

```
npm run migrate up
npm run migrate down
```
