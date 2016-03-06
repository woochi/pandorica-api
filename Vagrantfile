Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.synced_folder ".", "/vagrant", :mount_options => ["fmode=666"]
  config.ssh.insert_key = false

  config.vm.define "pandorica-api" do |pandorica|
    pandorica.vm.hostname = "pandorica-api"

    # forwarded ports
    pandorica.vm.network "forwarded_port", guest: 8081, host: 8081 # http

    # disable shared folder
    # pandorica.vm.synced_folder ".", "/vagrant", disabled: true

    # make machine faster
    pandorica.vm.provider "virtualbox" do |v|
      v.memory = 3072
      v.cpus = 2
    end
  end

  config.vm.provision :ansible do |ansible|
    ansible.extra_vars = { ansible_ssh_user: 'vagrant' }
    ansible.playbook = "ansible/rails-app-local.yml"
    ansible.inventory_path = "./ansible/hosts"
    ansible.limit = "all"
  end
end
