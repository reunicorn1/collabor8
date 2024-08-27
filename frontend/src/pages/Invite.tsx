import { useLazyInviteGuestQuery } from "@store/services/projectShare";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from '@chakra-ui/react';
import SignUp from "@components/Modals/SignUp";
import SignIn from "@components/Modals/SignIn";

/**
 * TODO: user story
 * user has account
 *  logged in ? forward
 *            : login then forward to editor/:id
 * ** uer has no account **
 *  - register and verify email
 *  - forward
 */
function InviteGuest() {
  const [invite, { data, isLoading, isUninitialized, isSuccess, isError }] = useLazyInviteGuestQuery();
  const [isOpen, setIsOpen] = useState(false);
  const { project_id } = useParams<string>();
  const parmas = new URLSearchParams(window.location.search);
  const invitee_email = parmas.get('invitee_email')!;
  const access_level = parmas.get('access_level')!;

  useEffect(() => {
    invite({ invitee_email, access_level, project_id })
      .unwrap()
      .then(data => {
        if (data.has_account) {
          // forward to editor/:project_id
        } else {

        }
      })
      .catch()
  }, [])

  return (
    <Skeleton size="lg" isLoaded={isUninitialized || !isLoading}>
      <SignUp
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => setIsOpen(false)}
      />
    </Skeleton>
  );
}

export default InviteGuest;
