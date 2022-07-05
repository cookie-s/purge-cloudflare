.PHONY: default deploy

PROJECT_ID=

default:
	;

deploy:
	test -n "$(PROJECT_ID)" # Specify PROJECT_ID
	gcloud functions deploy purgeAll \
		--runtime nodejs12 \
		--trigger-http \
		--allow-unauthenticated \
		--env-vars-file env.yml \
		--timeout 2s \
		--project $(PROJECT_ID)

# vim: noexpandtab
# TODO fix my vimrc
