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
