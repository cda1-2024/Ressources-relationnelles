# Fixtures explanation

## Users

50 users identified by an index:
- 1: Visitor
- 2 or 3: Super admin
- 4 or 5: Admin
- 6 to 15: Moderator
- 16 to 50: User

## Ressources

The visibility is cyclic, folowing the `Visibility` enum. The First ressource is `restricted`, the second is `public`, the third is `private`, the fourth is `restricted` again etc...

This is the same behavior with the ressourcetype in the enum `RessourceType`

50 ressources status identified by an index created by standard users:
- 1 to 10: published
- 11 to 20: suspended
- 21 to 30: toValidate
- 31 to 40: deleted
- 41 to 50: draft

## Comment

1 comment every 7 comments is disabled

100 comments identified by an index:
- 1 to 50: Main comment (without parents)
- 51 to 100: Secondary comment (is a child to one main comment)

## Category

10 categories identified by an index:
- 1 to 7: Enabled
- 8 to 10: Disabled
